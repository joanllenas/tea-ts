import * as RemoteData from '../lib/remote-data';

// getUserRepos

export type UserRepos = RemoteData.RemoteData<string, any[]>;

export function getUserRepos(username: string): Promise<UserRepos> {
  return fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => {
      if (!response.ok) {
        return RemoteData.failure(
          'Network response was not ok',
        ) satisfies UserRepos;
      }
      return response.json();
    })
    .then((data: JSON) => {
      // TODO: decode
      const value = data as unknown as any[];
      return RemoteData.success(value) satisfies UserRepos;
    })
    .catch((error) => {
      return RemoteData.failure(
        'There was a problem with your fetch operation: ' + error,
      ) satisfies UserRepos;
    });
}

// getUserRepo

export type GithubRepo = { name: string };
export type UserRepo = RemoteData.RemoteData<string, GithubRepo>;

export function getUserRepo(owner: string, repo: string): Promise<UserRepo> {
  return fetch(`https://api.github.com/repos/${owner}/${repo}`)
    .then((response) => {
      if (!response.ok) {
        return RemoteData.failure(
          'Network response was not ok',
        ) satisfies UserRepo;
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
        'There was a problem with your fetch operation: ' + error,
      ) satisfies UserRepo;
    });
}
