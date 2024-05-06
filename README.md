# Tea-ts

An experimental port of [The Elm Architecture](https://guide.elm-lang.org/architecture/) to Typescript.

## Program

```ts
// Simple Program
function simple<Model, Msg>(
  init: () => Model,
  update: (msg: Msg, model: Model) => Model,
  view: (model: Model) => Html.Html<Msg>,
);

// Program with managed effects
function advanced<Model, Msg, Eff, Flags>(
  init: (flags: Flags) => [Model, Eff],
  update: (msg: Msg, model: Model) => [Model, Eff],
  effects: (eff: Eff) => Effect.EffectFn<Msg>,
  subscriptions: (model: Model) => Subscription.Sub<Msg>,
  view: (model: Model) => Html.Html<Msg>,
);
```

## Counter

```ts
import * as Tea from './tea/program';
import * as Message from './tea/message';
import * as Html from './tea/html';

type Model = {
  count: number;
};

type Msg = Message.Msg<'Increment', number> | Message.Msg<'Decrement'>;

const msg: Message.MsgRecord<Msg> = {
  Increment: (n: number) => Message.msg('Increment', n),
  Decrement: () => Message.msg('Decrement'),
};

const init = (): Model => ({
  count: 0,
});

const update = (msg: Msg, model: Model): Model => {
  switch (msg.name) {
    case 'Increment': {
      return { count: model.count + msg.payload };
    }
    case 'Decrement': {
      return { count: model.count - 1 };
    }
  }
};

const view = (model: Model): Html.Html<Msg> => {
  return Html.div(
    [],
    [
      Html.h3([], [Html.text('Simple')]),
      Html.button([Html.onClick(() => msg.Increment(2))], [Html.text('+')]),
      Html.button([Html.onClick(() => msg.Decrement())], [Html.text('-')]),
      Html.div([], [Html.text('Count: ' + model.count)]),
    ],
  );
};

Tea.simple(init, update, view).run(document.getElementById('app')!);
```
