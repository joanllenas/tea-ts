export type Disposable = { dispose: () => void };

export type EffectFn<Msg> = (done: (msg: Msg) => void) => Disposable;

export type Effect<
  Name extends string,
  Payload = undefined
> = Payload extends undefined
  ? { name: Name }
  : { name: Name; payload: Payload };

// Effect constructor

export function eff<Name extends string>(name: Name): Effect<Name, undefined>;
export function eff<Name extends string, Payload>(
  name: Name,
  payload: Payload
): Effect<Name, Payload>;
export function eff<Name extends string, Payload>(
  name: Name,
  payload?: Payload
): Effect<Name, Payload> | Effect<Name, undefined> {
  if (payload === undefined) {
    return { name } as Effect<Name, undefined>;
  } else {
    return { name, payload } as Effect<Name, Payload>;
  }
}

// None effect

export const none: Effect<'none'> = { name: 'none' };
export type None = typeof none;
export function noneFn<Msg>(): EffectFn<Msg> {
  return () => ({ dispose: () => {} });
}

// Eff type generation

// Extracts the return type if it's a function, returnts the type otherwise
type ExtractEff<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

// Creates a union type with all Eff variants
export type ToEff<Variants> = {
  [K in keyof Variants]: ExtractEff<Variants[K]>;
}[keyof Variants];
