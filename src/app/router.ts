type Home = { kind: 'Home' };
type Cats = { kind: 'Cats' };
type Repos = { kind: 'Repos'; params: { username: string } };
type Repo = { kind: 'Repo'; params: { owner: string; repo: string } };
type NotFound = { kind: 'NotFound' };
type Route = Home | Cats | Repos | Repo | NotFound;

type RouteFunction<T extends Route> = T extends {
  kind: T['kind'];
  params: infer P;
}
  ? (params: P) => T
  : () => T;

type RouteItem<T extends Route> = {
  path: string;
  route: RouteFunction<T>;
};

export const parser = [
  { path: '/', route: () => ({ kind: 'Home' }) } satisfies RouteItem<Home>,
  { path: '/cats', route: () => ({ kind: 'Cats' }) } satisfies RouteItem<Cats>,
  {
    path: '/repos',
    route: (params) => ({ kind: 'Repos', params }),
  } satisfies RouteItem<Repos>,
  {
    path: '/repo/{owner}/{repo}',
    route: (params) => ({ kind: 'Repo', params }),
  } satisfies RouteItem<Repo>,
  {
    path: '*',
    route: () => ({ kind: 'NotFound' }),
  } satisfies RouteItem<NotFound>,
];
