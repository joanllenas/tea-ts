type Message<
  Name extends string,
  Payload = undefined
> = Payload extends undefined // this check is needed to avoid 'payload may be undefined' compiler errors
  ? { name: Name }
  : { name: Name; payload: Payload };

// Message constructor

export function msg<Name extends string>(name: Name): Message<Name, undefined>;
export function msg<Name extends string, Payload>(
  name: Name,
  payload: Payload
): Message<Name, Payload>;
export function msg<Name extends string, Payload>(
  name: Name,
  payload?: Payload
): Message<Name, Payload> | Message<Name, undefined> {
  if (payload === undefined) {
    return { name } as Message<Name, undefined>;
  } else {
    return { name, payload } as Message<Name, Payload>;
  }
}

// Msg type generation

// Extracts the return type if it's a function, returnts the type otherwise
type ExtractMsg<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

// Creates a union type with all Msg variants
export type ToMsg<Variants> = {
  [K in keyof Variants]: ExtractMsg<Variants[K]>;
}[keyof Variants];
