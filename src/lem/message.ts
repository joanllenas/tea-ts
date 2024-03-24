export type Message<
  Name extends string,
  Payload = undefined
> = Payload extends undefined // this check is needed to avoid 'payload may be undefined' compiler errors
  ? { name: Name }
  : { name: Name; payload: Payload };

export function msg<Name extends string, Payload>(
  name: Name,
  payload?: Payload
): Message<Name, Payload> | Message<Name, undefined> {
  return payload ? ({ name, payload } as Message<Name, Payload>) : { name };
}
