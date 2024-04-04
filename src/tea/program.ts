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
import * as Subscription from './subscription';

const patch = init([
  attributesModule,
  datasetModule,
  eventListenersModule,
  styleModule,
]);

export function simple<Model, Msg>(
  init: () => Model,
  update: (msg: Msg, model: Model) => Model,
  view: (model: Model) => Html.Html<Msg>,
) {
  return {
    run(node: Element): void {
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

export function advanced<Model, Msg, Eff extends Effect.Eff<string>, Flags>(
  init: (flags: Flags) => [Model, Eff],
  update: (msg: Msg, model: Model) => [Model, Eff],
  effects: (eff: Eff) => Effect.EffectFn<Msg>,
  subscriptions: (model: Model) => Subscription.Sub<Msg>,
  view: (model: Model) => Html.Html<Msg>,
) {
  return {
    run(node: Element, flags: Flags): void {
      if (node) {
        let vnode = patch(node, h('div', 'init'));
        const runningSubs = new Map<string, () => void>();
        const runningEffects = new Map<string, () => void>();

        const loop = ([model, effect]: [Model, Eff]) => {
          // VDom
          const newNode = html2vnode(view(model), model);
          vnode = patch(vnode, newNode);

          // Effects
          // TODO: handle batched effects
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

          // Subs
          const newSubs = subscriptions(model);
          // TODO: this is naive, same key could have a new sub
          // TODO: handle batched subs
          // Kill and remove (from old) the ones in old but not in new
          for (let [key, dispose] of runningSubs) {
            if (newSubs[key] === undefined) {
              dispose();
              // It's safe to delete items from a Map while iterating over it
              runningSubs.delete(key);
            }
          }
          // Initialize and add (to old) the ones in new but not in old
          for (let key in newSubs) {
            if (!runningSubs.has(key)) {
              const send = (msg: Msg) => {
                loop(update(msg, model));
              };
              const initSubFn = newSubs[key];
              runningSubs.set(key, initSubFn(send).dispose);
            }
          }
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
            if (cur.name === '') {
              return null;
            }
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

        loop(init(flags));
      } else {
        throw new Error('Could not mount app, node is not an Html Element');
      }
    },
  };
}
