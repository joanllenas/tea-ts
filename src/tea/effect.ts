export type Disposable = { dispose: () => void };

export type EffectFn<Msg> = (done: (msg: Msg) => void) => Disposable;

// Effect type constructor

export type Eff<
  Name extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: 'Effect'; name: Name }
  : { type: 'Effect'; name: Name; payload: Payload };

// Effect value constructor

export function eff<Name extends string>(name: Name): Eff<Name, undefined>;
export function eff<Name extends string, Payload>(
  name: Name,
  payload: Payload
): Eff<Name, Payload>;
export function eff<Name extends string, Payload>(
  name: Name,
  payload?: Payload
): Eff<Name, Payload> | Eff<Name, undefined> {
  if (payload === undefined) {
    return { name } as Eff<Name, undefined>;
  } else {
    return { name, payload } as Eff<Name, Payload>;
  }
}

// None effect

export const none: Eff<'None'> = { type: 'Effect', name: 'None' };
export type None = typeof none;
export function noneFn<Msg>(): EffectFn<Msg> {
  return () => ({ dispose: () => {} });
}

// Eff Record type generation

export type EffRecord<E extends Eff<string>> = Record<
  E['name'],
  (...args: any) => E
>;
