export type Disposable = { dispose: () => void };

export type SubFn<Msg> = (send: (msg: Msg) => void) => Disposable;

export type Sub<Msg> = Record<string, SubFn<Msg>>;
