// Message type constructor

export type Msg<
  Name extends string,
  Payload = undefined,
> = Payload extends undefined // this check is needed to avoid 'payload may be undefined' compiler errors
  ? { type: 'Msg'; name: Name }
  : { type: 'Msg'; name: Name; payload: Payload };

// Message value constructor

export function msg<Name extends string>(name: Name): Msg<Name, undefined>;
export function msg<Name extends string, Payload>(
  name: Name,
  payload: Payload,
): Msg<Name, Payload>;
export function msg<Name extends string, Payload>(
  name: Name,
  payload?: Payload,
): Msg<Name, Payload> | Msg<Name, undefined> {
  if (payload === undefined) {
    return { name } as Msg<Name, undefined>;
  } else {
    return { name, payload } as Msg<Name, Payload>;
  }
}

// Helper type to extract payload type for a given message
type ExtractPayloadType<Name extends string, M extends Msg<string>> =
  M extends Msg<Name, infer Payload> ? Payload : never;

// Msg Record type generation using conditional types to infer payload
export type MsgRecord<M extends Msg<string, any>> = {
  [K in M['name']]: ExtractPayloadType<K, M> extends never
    ? () => M
    : (payload: ExtractPayloadType<K, M>) => M;
};
