// Message type constructor
export type Msg<
  Name extends string,
  Payload = undefined
> = Payload extends undefined // this check is needed to avoid 'payload may be undefined' compiler errors
  ? { name: Name }
  : { name: Name; payload: Payload };

// Message value constructor

export function msg<Name extends string>(name: Name): Msg<Name, undefined>;
export function msg<Name extends string, Payload>(
  name: Name,
  payload: Payload
): Msg<Name, Payload>;
export function msg<Name extends string, Payload>(
  name: Name,
  payload?: Payload
): Msg<Name, Payload> | Msg<Name, undefined> {
  if (payload === undefined) {
    return { name } as Msg<Name, undefined>;
  } else {
    return { name, payload } as Msg<Name, Payload>;
  }
}

// Msg Record type generation

export type MsgRecord<M extends Msg<string>> = Record<
  M['name'],
  (...args: any) => M
>;
