// TYPES

type NotAsked = { type: 'RemoteData.NotAsked' };
type Loading = { type: 'RemoteData.Loading' };
type Failure<E> = { type: 'RemoteData.Failure'; error: E };
type Success<T> = { type: 'RemoteData.Success'; value: T };

export type RemoteData<E, T> = NotAsked | Loading | Failure<E> | Success<T>;

// CONSTRUCTORS

export const notAsked = <E, T>(): RemoteData<E, T> => ({
  type: 'RemoteData.NotAsked',
});

export const loading = <E, T>(): RemoteData<E, T> => ({
  type: 'RemoteData.Loading',
});
export const failure = <E, T>(error: E): RemoteData<E, T> => ({
  type: 'RemoteData.Failure',
  error,
});
export const success = <E, T>(value: T): RemoteData<E, T> => ({
  type: 'RemoteData.Success',
  value,
});

// GUARDS

export function isNotAsked<E, T>(rd: RemoteData<E, T>): rd is NotAsked {
  return rd.type === 'RemoteData.NotAsked';
}

export function isLoading<E, T>(rd: RemoteData<E, T>): rd is Loading {
  return rd.type === 'RemoteData.Loading';
}

export function isFailure<E, T>(rd: RemoteData<E, T>): rd is Failure<E> {
  return rd.type === 'RemoteData.Failure';
}

export function isSuccess<E, T>(rd: RemoteData<E, T>): rd is Success<T> {
  return rd.type === 'RemoteData.Success';
}
