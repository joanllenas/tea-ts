import './style.css';
import * as Message from './lem/message';
import * as Effect from './lem/effect';
import * as Html from './lem/html';

// MODEL

type Model = {
  count: number;
  increment: number;
  decrement: number;
  loading: boolean;
};

// INIT

export const init = (): [Model, Eff] => [
  {
    count: 0,
    increment: 1,
    decrement: 1,
    loading: false,
  },
  Effect.none,
];

// UPDATE

const Increment = Message.msg('Increment');
const Decrement = Message.msg('Decrement');
const GetIncrement = Message.msg('GetIncrement');
const GotIncrement = (n: number) => Message.msg('GotIncrement', n);
const GetDecrement = Message.msg('GetDecrement');
const GotDecrement = (n: number) => Message.msg('GotDecrement', n);

type Msg =
  | typeof Increment
  | typeof Decrement
  | typeof GetIncrement
  | ReturnType<typeof GotIncrement>
  | typeof GetDecrement
  | ReturnType<typeof GotDecrement>;

export const update = (msg: Msg, model: Model): [Model, Eff] => {
  switch (msg.name) {
    case 'Increment': {
      return [{ ...model, count: model.count + model.increment }, Effect.none];
    }
    case 'Decrement': {
      return [{ ...model, count: model.count - model.decrement }, Effect.none];
    }
    case 'GetIncrement': {
      return [{ ...model, loading: true }, { name: 'GetIncrement' }];
    }
    case 'GotIncrement': {
      return [
        { ...model, loading: false, increment: msg.payload },
        Effect.none,
      ];
    }
    case 'GetDecrement': {
      return [{ ...model, loading: true }, { name: 'GetDecrement' }];
    }
    case 'GotDecrement': {
      return [
        { ...model, loading: false, decrement: msg.payload },
        Effect.none,
      ];
    }
  }
};

// EFFECTS

type Eff =
  | Effect.None
  | Effect.Effect<'GetIncrement'>
  | Effect.Effect<'GetDecrement'>;

export const effects = (eff: Eff): Effect.EffectFn<Msg> => {
  switch (eff.name) {
    case 'GetIncrement': {
      return function (done) {
        const ref = setTimeout(
          () =>
            done({
              name: 'GotIncrement',
              payload: Math.round(Math.random() * 10),
            }),
          1000
        );
        return {
          dispose: () => {
            clearTimeout(ref);
          },
        };
      };
    }
    case 'GetDecrement': {
      return function (done) {
        const ref = setTimeout(
          () =>
            done({
              name: 'GotDecrement',
              payload: Math.round(Math.random() * 10),
            }),
          1000
        );
        return {
          dispose: () => {
            clearTimeout(ref);
          },
        };
      };
    }

    case 'none': {
      return Effect.noneFn<Msg>();
    }
  }
};

// VIEW

export const view = (model: Model): Html.Html<Msg> => {
  return Html.div(
    [Html.className('border-1 padding-xl')],
    [
      Html.h2([], [Html.text('Element')]),
      Html.div<Msg>(
        [Html.classNames(['flex-column', model.loading && 'loading'])],
        [
          Html.button(
            [Html.onClick(GetIncrement)],
            [Html.text('Get increment')]
          ),
          Html.button(
            [Html.onClick(GetDecrement)],
            [Html.text('Get decrement')]
          ),
        ]
      ),
      Html.div<Msg>( // FIXME: fix type inference. Should be inferred from the funciton signature
        [],
        [
          Html.button(
            [Html.onClick(Increment)],
            [Html.text('+' + model.increment)]
          ),
          Html.button(
            [Html.onClick(Decrement)],
            [Html.text('-' + model.decrement)]
          ),
        ]
      ),
      Html.div([], [Html.text('Count: ' + model.count)]),
    ]
  );
};
