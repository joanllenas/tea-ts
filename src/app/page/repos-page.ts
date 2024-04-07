import * as Message from '../../tea/message';
import * as Effect from '../../tea/effect';
import * as Html from '../../tea/html';
import * as Github from '../github';
import * as RemoteData from '../../lib/remote-data';

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

export type Msg =
  | Message.Msg<'UserChangedUsername', string>
  | Message.Msg<'UserRequestedRepos'>
  | Message.Msg<'BackendReturnedRepos', Github.UserRepos>;

export const msg: Message.MsgRecord<Msg> = {
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
      return [
        { ...model, repos: RemoteData.loading() },
        eff.GetUserRepos(model.username),
      ];
    }
    case 'BackendReturnedRepos': {
      return [{ ...model, repos: msg.payload }, Effect.none];
    }
  }
};

// EFFECTS

export type Eff = Effect.None | Effect.Eff<'GetUserRepos', string>;

export const eff: Effect.EffRecord<Eff> = {
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
          done.withMessage(msg.BackendReturnedRepos(result));
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
      Html.form(
        [
          Html.classNames(['flex-column']),
          Html.onSubmit(() => msg.UserRequestedRepos()),
        ],
        [
          Html.label(
            [],
            [
              Html.text('Username'),
              Html.input(
                [
                  Html.attr('value', model.username),
                  Html.onInput((evt) =>
                    msg.UserChangedUsername(
                      (evt.target as HTMLInputElement).value,
                    ),
                  ),
                ],
                [],
              ),
            ],
          ),
          Html.button(
            [Html.attr('disabled', model.username === '')],
            [Html.text('Get repos')],
          ),
        ],
      ),
      RemoteData.isSuccess(model.repos)
        ? viewRepos(model.repos.value)
        : RemoteData.isLoading(model.repos)
          ? Html.div([], [Html.text(`Loading ${model.username}'s repos`)])
          : RemoteData.isFailure(model.repos)
            ? Html.div(
                [],
                [Html.text(`There has been an error: ${model.repos.error}.`)],
              )
            : Html.div([], [Html.text('Type a username and hit "Get repos"')]),
    ],
  );
};

function viewRepos(repos: Github.GithubRepo[]): Html.Html<Msg> {
  return Html.ul(
    [],
    repos.map((repo) => {
      return Html.li(
        [],
        [Html.a([Html.attr('href', repo.html_url)], [Html.text(repo.name)])],
      );
    }),
  );
}
