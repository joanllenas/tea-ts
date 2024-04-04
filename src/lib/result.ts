type Ok<T> = { type: 'Result.Ok'; value: T };
type Err<E> = { type: 'Result.Err'; error: E };

export type Result<E, T> = Ok<T> | Err<E>;

export const ok = <E, T>(value: T): Result<E, T> => ({
  type: 'Result.Ok',
  value,
});

export const err = <E, T>(error: E): Result<E, T> => ({
  type: 'Result.Err',
  error,
});
