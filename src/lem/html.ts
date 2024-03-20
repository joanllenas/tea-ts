import { $LemMessage } from './message';

// TYPES

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

// DOM Factory functions

export function node<Msg>(
  tag: string,
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

export function div<Msg>(
  attributes: Attribute<Msg>[],
  children: Html<Msg>[]
): Html<Msg> {
  return node('div', attributes, children);
}

export function button<Msg>(
  attributes: Attribute<Msg>[],
  children: Html<Msg>[]
): Html<Msg> {
  return node('button', attributes, children);
}

export function text<Msg>(text: string): Html<Msg> {
  return {
    type: 'Text',
    text,
  };
}

// DOM Attribute factory functions

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
