import * as RemoteData from '../lib/remote-data';

export type GithubRepo = {
  name: string;
  html_url: string;
};

// getUserRepos

export type UserRepos = RemoteData.RemoteData<string, GithubRepo[]>;

export function getUserRepos(username: string): Promise<UserRepos> {
  return fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => {
      if (!response.ok) {
        throw Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data: JSON) => {
      console.log('success');
      // TODO: decode
      const value = data as unknown as any[];
      return RemoteData.success(value) satisfies UserRepos;
    })
    .catch((error) => {
      return RemoteData.failure(
        'There was a problem with your fetch operation: ' + error.message,
      ) satisfies UserRepos;
    });
}

// getUserRepo

export type UserRepo = RemoteData.RemoteData<string, GithubRepo>;

export function getUserRepo(owner: string, repo: string): Promise<UserRepo> {
  return fetch(`https://api.github.com/repos/${owner}/${repo}`)
    .then((response) => {
      if (!response.ok) {
        throw Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data: JSON) => {
      // TODO: decode
      const value = data as unknown as GithubRepo;
      return RemoteData.success(value) satisfies UserRepo;
    })
    .catch((error) => {
      return RemoteData.failure(
        'There was a problem with your fetch operation: ' + error.message,
      ) satisfies UserRepo;
    });
}
