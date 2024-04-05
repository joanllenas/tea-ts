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

type Scheduler<Msg> = {
  queue: (msg: Msg) => void;
};

function html2vnode<Model, Msg>(
  html: Html.Html<Msg>,
  model: Model,
  scheduler: Scheduler<Msg>,
): VNode {
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
        scheduler.queue(cur.msg);
      };
    } else if (Html.isAttr(cur)) {
      nodeData.attrs![cur.name] = cur.value;
    }
  });

  // Children
  const children = html.children.map((cur) => {
    return html2vnode(cur, model, scheduler);
  });

  return h(html.tag, nodeData, children);
}

// ----------------------------
//
// SIMPLE PROGRAM
//
// ----------------------------

export function simple<Model, Msg>(
  init: () => Model,
  update: (msg: Msg, model: Model) => Model,
  view: (model: Model) => Html.Html<Msg>,
) {
  return {
    run(node: Element): void {
      if (node) {
        let vnode = patch(node, h('div', 'init'));
        let model = init();
        const scheduler: Scheduler<Msg> = initScheduler();
        let raf = render();

        function render() {
          return window.requestAnimationFrame(() => {
            const newNode = html2vnode(view(model), model, scheduler);
            vnode = patch(vnode, newNode);
          });
        }

        function initScheduler() {
          return {
            queue: (msg: Msg) => {
              window.cancelAnimationFrame(raf);
              model = update(msg, model);

              // ----------------------------
              // Render VDom
              // ----------------------------
              raf = render();
            },
          };
        }
      } else {
        throw new Error('Could not mount app, node is not an Html Element');
      }
    },
  };
}

// ----------------------------
//
// ADVANCED PROGRAM
//
// ----------------------------

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
        let [model, effect] = init(flags);
        const scheduler: Scheduler<Msg> = initScheduler();
        let raf = render();

        function render() {
          return window.requestAnimationFrame(() => {
            const newNode = html2vnode(view(model), model, scheduler);
            vnode = patch(vnode, newNode);
          });
        }

        function initScheduler() {
          return {
            queue: (msg: Msg) => {
              window.cancelAnimationFrame(raf);
              [model, effect] = update(msg, model);

              // ----------------------------
              // Effects
              // ----------------------------

              // TODO: handle batched effects
              const effectFn = effects(effect);
              const done = (msg: Msg) => {
                runningEffects.delete(effect.name);
                scheduler.queue(msg);
              };
              if (runningEffects.has(effect.name)) {
                const disposeFn = runningEffects.get(effect.name)!;
                disposeFn();
                runningEffects.delete(effect.name);
              }
              runningEffects.set(effect.name, effectFn(done).dispose);

              // ----------------------------
              // Subs
              // ----------------------------
              const newSubs = subscriptions(model);
              // TODO: this is naive, same key could have a new sub
              // TODO: handle batched subs
              // Kill and remove (from old) the ones in old but not in new
              for (let [key, dispose] of runningSubs) {
                if (newSubs[key] === undefined) {
                  dispose();
                  runningSubs.delete(key);
                }
              }
              // Initialize and add (to old) the ones in new but not in old
              for (let key in newSubs) {
                if (!runningSubs.has(key)) {
                  const send = (msg: Msg) => {
                    scheduler.queue(msg);
                  };
                  const initSubFn = newSubs[key];
                  runningSubs.set(key, initSubFn(send).dispose);
                }
              }

              // ----------------------------
              // Render VDom
              // ----------------------------
              raf = render();
            },
          };
        }
      } else {
        throw new Error('Could not mount app, node is not an Html Element');
      }
    },
  };
}
