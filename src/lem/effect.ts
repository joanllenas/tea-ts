import { Message } from './message';

export type Disposable = { dispose: () => void };

export type EffectFn<Msg extends Message<string>> = (
  done: (msg: Msg) => void
) => Disposable;

export type Effect<
  Name extends string,
  Payload = undefined
> = Payload extends undefined
  ? { name: Name }
  : { name: Name; payload: Payload };

export const none: Effect<'none'> = { name: 'none' };
export type None = typeof none;
export function noneFn<Msg extends Message<string>>(): EffectFn<Msg> {
  return () => ({ dispose: () => {} });
}
