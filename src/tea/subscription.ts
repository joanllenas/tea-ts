export type Disposable = { dispose: () => void };

export type SubFn<Msg> = (update: (msg: Msg) => void) => Disposable;

export type Sub<Msg> = Record<string, SubFn<Msg>>;
