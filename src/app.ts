import './style.css';
import * as Message from './tea/message';
import * as Effect from './tea/effect';
import * as Subscription from './tea/subscription';
import * as Html from './tea/html';
import * as Nav from './tea/navigation';
import * as NotFoundPage from './app/page/not-found';
import * as ReposPage from './app/page/repos-page';
import * as RepoPage from './app/page/repo-page';

// MODEL

type Model = {
  url: string;
  home: { title: string };
  cats: { title: string };
  repos: ReposPage.Model;
  repo: RepoPage.Model;
};

// INIT

export const init = (flags: { url: string }): [Model, Eff] => {
  const [reposModel, reposEffects] = ReposPage.init();
  const [repoModel, repoEffects] = RepoPage.init();
  return [
    {
      url: flags.url,
      home: { title: 'Home' },
      cats: { title: 'Cats' },
      repos: reposModel,
      repo: repoModel,
    },
    Effect.none,
    //Effect.batch([reposEffects, repoEffects]),
  ];
};

// UPDATE

type Msg =
  | Message.Msg<'LinkClicked', Nav.UrlRequest>
  | Message.Msg<'UrlChanged', string>
  | ReposPage.Msg;

const msg: Message.MsgRecord<Msg> = {
  LinkClicked: (urlRequest) => Message.msg('LinkClicked', urlRequest),
  UrlChanged: (url) => Message.msg('UrlChanged', url),
  ...ReposPage.msg,
};

export const update = (msg: Msg, model: Model): [Model, Eff] => {
  switch (msg.name) {
    case 'LinkClicked': {
      if (Nav.isInternal(msg.payload)) {
        return [
          { ...model, url: msg.payload.url },
          eff.NavPushUrl(msg.payload.url),
        ];
      }
      return [model, eff.NavLoad(msg.payload.url)];
    }
    case 'UrlChanged': {
      let eff = Effect.none;
      return [{ ...model, url: msg.payload }, eff];
    }
    case 'UserRequestedRepos':
    case 'BackendReturnedRepos':
    case 'UserChangedUsername': {
      const [reposModel, reposEffects] = ReposPage.update(msg, model.repos);
      return [{ ...model, repos: reposModel }, reposEffects];
    }
  }
};

// EFFECTS

type Eff = Effect.None | Nav.Effects | ReposPage.Eff;

const eff: Effect.EffRecord<Eff> = {
  //None: () => Effect.none,
  ...Nav.eff,
  ...ReposPage.eff,
};

export const effects = (effect: Eff): Effect.EffectFn<Msg> => {
  switch (effect.name) {
    case 'None': {
      return Effect.noneFn<Msg>();
    }
    case 'NavPushUrl': {
      return Nav.pushUrl(effect.payload);
    }
    case 'NavLoad': {
      return Nav.load(effect.payload);
    }
    case 'GetUserRepos': {
      return ReposPage.effects(effect);
    }
  }
};

// SUBSCRIPTIONS

export const subscriptions = (_: Model): Subscription.Sub<Msg> => {
  return { ...Nav.subscriptions(msg.LinkClicked, msg.UrlChanged) };
};

// VIEW

export const view = (model: Model): Html.Html<Msg> => {
  return Html.div(
    [Html.className('container border padding-lg flex-column gap-lg')],
    [
      Html.h3([], [Html.text('SPA')]),
      Html.span([], [Html.text('Url: ' + model.url)]),
      Html.div(
        [Html.className('flex gap-lg')],
        [
          sidebar([
            ['', 'Internal'],
            ['/', 'Home'],
            ['/cats', 'Cats'],
            ['/repos', 'Repos'],
            ['/aaaaa', 'Not found'],
            ['', 'External'],
            ['https://elm-lang.org/', 'Elm'],
            ['https://www.typescriptlang.org/', 'Typescript'],
          ]),
          pageContent(model),
        ],
      ),
    ],
  );
};

function sidebar(links: [string, string][]): Html.Html<Msg> {
  return Html.nav(
    [Html.className('flex-column gap-sm padding-r-md border-r')],
    links.map(([href, label]) =>
      href
        ? Html.a([Html.attr('href', href)], [Html.text(label)])
        : Html.h4([], [Html.text(label)]),
    ),
  );
}

function pageContent(model: Model): Html.Html<Msg> {
  const url = new URL(model.url);
  switch (url.pathname) {
    case '/':
      return Html.div(
        [],
        [
          Html.h1([], [Html.text('Home')]),
          Html.div([], [Html.text('Lorem ipsum dolor sit amet, '.repeat(10))]),
        ],
      );
    case '/cats':
      return Html.div(
        [],
        [
          Html.h1([], [Html.text('Cats')]),
          Html.img(
            [
              Html.className('image-frame'),
              Html.attr('src', 'https://cataas.com/cat'),
            ],
            [],
          ),
        ],
      );
    case '/repos':
      return ReposPage.view(model.repos);
    case '/repo':
      return Html.div([], [Html.h1([], [Html.text('Repo')])]);
  }
  return NotFoundPage.view(url.pathname);
}
