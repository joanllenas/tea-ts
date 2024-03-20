export type $LemMessage = { name: string; payload?: unknown };
export type Message<T extends $LemMessage> = T;
