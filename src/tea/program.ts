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
import * as Effect from './effect';

const patch = init([
  attributesModule,
  datasetModule,
  eventListenersModule,
  styleModule,
]);

type Program = {
  run: (node: Element) => void;
};

export function simple<Model, Msg>(
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
            if (Html.isEvent(cur)) {
              nodeData.on![cur.name] = () => {
                loop(update(cur.msg, model));
              };
            } else if (Html.isAttr(cur)) {
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

export function advanced<Model, Msg, Eff extends Effect.Effect<string>>(
  init: () => [Model, Eff],
  update: (msg: Msg, model: Model) => [Model, Eff],
  effects: (eff: Eff) => Effect.EffectFn<Msg>,
  view: (model: Model) => Html.Html<Msg>
): Program {
  return {
    run(node) {
      if (node) {
        let vnode = patch(node, h('div', 'init'));
        const runningEffects = new Map<string, () => void>();
        const loop = ([model, effect]: [Model, Eff]) => {
          const newNode = html2vnode(view(model), model);
          vnode = patch(vnode, newNode);
          const effectFn = effects(effect);
          const done = (msg: Msg) => {
            runningEffects.delete(effect.name);
            loop(update(msg, model));
          };
          if (runningEffects.has(effect.name)) {
            const disposeFn = runningEffects.get(effect.name)!;
            disposeFn();
            runningEffects.delete(effect.name);
          }
          runningEffects.set(effect.name, effectFn(done).dispose);
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
            if (Html.isEvent(cur)) {
              nodeData.on![cur.name] = () => {
                loop(update(cur.msg, model));
              };
            } else if (Html.isAttr(cur)) {
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
