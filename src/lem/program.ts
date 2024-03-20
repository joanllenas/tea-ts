import {
  init,
  attributesModule,
  datasetModule,
  styleModule,
  eventListenersModule,
  h,
  VNodeData,
  VNode,
} from 'snabbdom';
import * as Html from './html';
import { $LemMessage } from './message';

const patch = init([
  attributesModule,
  datasetModule,
  eventListenersModule,
  styleModule,
]);

type Program = {
  run: (node: Element) => void;
};

export function sandbox<Model, Msg extends $LemMessage>(
  init: () => Model,
  update: (msg: Msg, model: Model) => Model,
  view: (model: Model) => Html.Html<Msg>
): Program {
  return {
    run(node) {
      if (node) {
        let vnode = patch(node, h('div', 'init'));
        const loop = (model: Model) => {
          const newNode = html2vnode(view(model), model);
          vnode = patch(vnode, newNode);
        };

        function html2vnode(html: Html.Html<Msg>, model: Model): VNode {
          if (html.type === 'Text') {
            return h('span', html.text);
          }

          let nodeData: VNodeData = {
            on: {},
            attrs: {},
            children: [],
          };

          // Attrs
          html.attributes.forEach((cur) => {
            if (isEvent(cur)) {
              nodeData.on![cur.name] = () => {
                loop(update(cur.msg, model));
              };
            } else if (isAttr(cur)) {
              nodeData.attrs![cur.name] = cur.value;
            }
          });

          // Children
          const children = html.children.map((cur) => {
            return html2vnode(cur, model);
          });

          return h(html.tag, nodeData, children);
        }

        loop(init());
      } else {
        throw new Error('Could not mount app, node is not an Html Element');
      }
    },
  };
}

function isEvent<Msg>(attr: Html.Attribute<Msg>): attr is Html.Evt<Msg> {
  return attr.type === 'Evt';
}
function isAttr<Msg>(attr: Html.Attribute<Msg>): attr is Html.Attr {
  return attr.type === 'Attr';
}