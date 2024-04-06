export type Disposable = { dispose: () => void };

export type EffectFn<Msg> = (done: (msg: Msg) => void) => Disposable;

// Effect type constructor

export type Eff<
  Name extends string,
  Payload = undefined,
> = Payload extends undefined
  ? { type: 'Effect'; name: Name }
  : { type: 'Effect'; name: Name; payload: Payload };

// Effect value constructor

export function eff<Name extends string>(name: Name): Eff<Name, undefined>;
export function eff<Name extends string, Payload>(
  name: Name,
  payload: Payload,
): Eff<Name, Payload>;
export function eff<Name extends string, Payload>(
  name: Name,
  payload?: Payload,
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

// Batch effect

export const batch = <Name extends string, Payload>(list: Eff<Name, Payload>) =>
  eff('Batch', list);

// Helper type to extract payload type for a given effect
type ExtractPayloadType<Name extends string, E extends Eff<string>> =
  E extends Eff<Name, infer Payload> ? Payload : never;

// Eff Record type generation using conditional types to infer payload
export type EffRecord<E extends Eff<string, any>> = {
  [K in E['name']]: ExtractPayloadType<K, E> extends never
    ? () => E
    : (payload: ExtractPayloadType<K, E>) => E;
};
