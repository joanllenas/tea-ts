import './style.css';
import * as Message from './tea/message';
import * as Effect from './tea/effect';
import * as Html from './tea/html';
import * as UserReposPage from './app/repos-page';
import * as UserRepoPage from './app/repo-page';

// MODEL

type Page<PageModel, Path extends string> = {
  type: 'App.Page';
  path: Path;
  model: PageModel;
};

type Pages =
  | Page<UserReposPage.Model, '/user-repos'>
  | Page<UserRepoPage.Model, '/user/{owner}/repo/{repo}'>;

type Model = {
  url: string;
  //page: Pages;
};

// INIT

export const init = (): [Model, Eff] => [
  {
    url: '?????',
    //page: parseUrlAndFindPage(...)
  },
  Effect.none,
];

// UPDATE

type Msg =
  | Message.Msg<'Increment'>
  | Message.Msg<'Decrement'>
  | Message.Msg<'GetIncrement'>
  | Message.Msg<'GotIncrement', number>
  | Message.Msg<'GetDecrement'>
  | Message.Msg<'GotDecrement', number>;

const msg: Message.MsgRecord<Msg> = {
  Increment: () => Message.msg('Increment'),
  Decrement: () => Message.msg('Decrement'),
  GetIncrement: () => Message.msg('GetIncrement'),
  GotIncrement: (n: number) => Message.msg('GotIncrement', n),
  GetDecrement: () => Message.msg('GetDecrement'),
  GotDecrement: (n: number) => Message.msg('GotDecrement', n),
};

export const update = (msg: Msg, model: Model): [Model, Eff] => {
  switch (msg.name) {
    case 'Increment': {
      return [{ ...model, count: model.count + model.increment }, Effect.none];
    }
    case 'Decrement': {
      return [{ ...model, count: model.count - model.decrement }, Effect.none];
    }
    case 'GetIncrement': {
      return [{ ...model, loading: true }, eff.GetIncrement()];
    }
    case 'GotIncrement': {
      return [
        { ...model, loading: false, increment: msg.payload },
        Effect.none,
      ];
    }
    case 'GetDecrement': {
      return [{ ...model, loading: true }, eff.GetDecrement()];
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
  | Effect.Eff<'GetIncrement'>
  | Effect.Eff<'GetDecrement'>;

const eff: Effect.EffRecord<Eff> = {
  None: () => Effect.none,
  GetIncrement: () => Effect.eff('GetIncrement'),
  GetDecrement: () => Effect.eff('GetDecrement'),
};

export const effects = (effect: Eff): Effect.EffectFn<Msg> => {
  switch (effect.name) {
    case 'None': {
      return Effect.noneFn<Msg>();
    }
    case 'GetIncrement': {
      return function (done) {
        const ref = setTimeout(
          () => done(msg.GotIncrement(Math.round(Math.random() * 100))),
          1000,
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
          () => done(msg.GotDecrement(Math.round(Math.random() * 100))),
          1000,
        );
        return {
          dispose: () => {
            clearTimeout(ref);
          },
        };
      };
    }
  }
};

// VIEW

export const view = (model: Model): Html.Html<Msg> => {
  return Html.div(
    [Html.className('border-1 padding-xl')],
    [
      Html.h2([], [Html.text('Advanced')]),
      Html.div(
        [Html.classNames(['flex-column', model.loading && 'loading'])],
        [
          Html.button(
            [Html.onClick(msg.GetIncrement())],
            [Html.text('Get increment')],
          ),
          Html.button(
            [Html.onClick(msg.GetDecrement())],
            [Html.text('Get decrement')],
          ),
        ],
      ),
      Html.div(
        [],
        [
          Html.button(
            [Html.onClick(msg.Increment())],
            [Html.text('+' + model.increment)],
          ),
          Html.button(
            [Html.onClick(msg.Decrement())],
            [Html.text('-' + model.decrement)],
          ),
        ],
      ),
      Html.div([], [Html.text('Count: ' + model.count)]),
    ],
  );
};
