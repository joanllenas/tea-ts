import * as Message from '../../tea/message';
import * as Effect from '../../tea/effect';
import * as Html from '../../tea/html';
import * as Github from '../github';
import * as RemoteData from '../../lib/remote-data';

// Model

export type Model = {
  username: string;
  reponame: string;
  repo: Github.UserRepo;
};

// INIT

export const init = (): [Model, Eff] => [
  {
    username: '',
    reponame: '',
    repo: RemoteData.notAsked(),
  },
  Effect.none,
];

// EFFECTS

type Eff = Effect.None;
