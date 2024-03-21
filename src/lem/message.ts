export type Message<
  Name extends string,
  Payload = undefined
> = Payload extends undefined
  ? { name: Name }
  : { name: Name; payload: Payload };
