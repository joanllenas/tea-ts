type Just<T> = { type: 'Maybe.Just'; value: T };
type Nothing = { type: 'Maybe.Nothing' };

export type Maybe<T> = Just<T> | Nothing;

export const just = <T>(value: T): Maybe<T> => ({
  type: 'Maybe.Just',
  value,
});

export const nothing = <T>(): Maybe<T> => ({
  type: 'Maybe.Nothing',
});
