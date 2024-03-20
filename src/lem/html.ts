import { $LemMessage } from './message';

export type Attr = {
  type: 'Attr';
  name: string;
  value: string | number | boolean;
};
export type Evt<Msg> = { type: 'Evt'; name: string; msg: Msg };
export type Attribute<Msg> = Attr | Evt<Msg>;
export type Html<Msg> =
  | {
      type: 'Html';
      tag: string;
      attributes: Attribute<Msg>[];
      children: Html<Msg>[];
    }
  | { type: 'Text'; text: string };

export function node<Msg, Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  attributes: Attribute<Msg>[],
  children: Html<Msg>[]
): Html<Msg> {
  return {
    type: 'Html',
    tag,
    attributes,
    children,
  };
}

export function text<Msg>(text: string): Html<Msg> {
  return {
    type: 'Text',
    text,
  };
}

export function attr(name: string, value: string | number | boolean): Attr {
  return {
    type: 'Attr',
    name,
    value,
  };
}

export function on<Msg extends $LemMessage>(name: string, msg: Msg): Evt<Msg> {
  return {
    type: 'Evt',
    name,
    msg,
  };
}
