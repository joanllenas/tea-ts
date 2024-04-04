import * as Message from '../tea/message';
import * as Effect from '../tea/effect';
import * as Html from '../tea/html';
import * as Github from './github';
import * as RemoteData from '../lib/remote-data';

// Model

export type Model = {
  repo: Github.UserRepo;
};
