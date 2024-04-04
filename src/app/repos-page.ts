import * as Message from '../tea/message';
import * as Effect from '../tea/effect';
import * as Html from '../tea/html';
import * as Github from './github';
import * as RemoteData from '../lib/remote-data';

// Model

export type Model = {
  username: string;
  repos: Github.UserRepos;
};

// INIT

export const init = (): [Model, Eff] => [
  {
    username: '',
    repos: RemoteData.notAsked(),
  },
  Effect.none,
];

// UPDATE

type Msg =
  | Message.Msg<'UserChangedUsername', string>
  | Message.Msg<'UserRequestedRepos'>
  | Message.Msg<'BackendReturnedRepos', Github.UserRepos>;

const msg: Message.MsgRecord<Msg> = {
  UserChangedUsername: (username: string) =>
    Message.msg('UserChangedUsername', username),
  UserRequestedRepos: () => Message.msg('UserRequestedRepos'),
  BackendReturnedRepos: (repos: Github.UserRepos) =>
    Message.msg('BackendReturnedRepos', repos),
};

export const update = (msg: Msg, model: Model): [Model, Eff] => {
  switch (msg.name) {
    case 'UserChangedUsername': {
      return [{ ...model, username: msg.payload }, Effect.none];
    }
    case 'UserRequestedRepos': {
      return [{ ...model, repos: RemoteData.loading() }, eff.GetUserRepos()];
    }
    case 'BackendReturnedRepos': {
      return [{ ...model, repos: msg.payload }, Effect.none];
    }
  }
};

// EFFECTS

type Eff = Effect.None | Effect.Eff<'GetUserRepos', string>;

const eff: Effect.EffRecord<Eff> = {
  None: () => Effect.none,
  GetUserRepos: (username: string) => Effect.eff('GetUserRepos', username),
};

export const effects = (effect: Eff): Effect.EffectFn<Msg> => {
  switch (effect.name) {
    case 'None': {
      return Effect.noneFn<Msg>();
    }
    case 'GetUserRepos': {
      return function (done) {
        Github.getUserRepos(effect.payload).then((result) => {
          done(msg.BackendReturnedRepos(result));
        });
        return {
          dispose: () => {},
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
      Html.h2([], [Html.text('Github user repos')]),
      Html.div(
        [Html.classNames(['flex-column'])],
        [
          Html.label(
            [],
            [
              Html.text('Username'),
              Html.input([Html.onInput(msg.UserChangedUsername())], []),
            ],
          ),
          Html.button(
            [Html.onClick(msg.UserRequestedRepos())],
            [Html.text('Get decrement')],
          ),
        ],
      ),
      Html.div([], [Html.text('Repos: ' + model.repos.type)]),
    ],
  );
};
