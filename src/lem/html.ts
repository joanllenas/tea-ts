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

// HTML tags Factory functions

function createTagFunction(tag: string) {
  return function <Msg>(
    attributes: Attribute<Msg>[],
    children: Html<Msg>[]
  ): Html<Msg> {
    return node(tag, attributes, children);
  };
}

export function text<Msg>(text: string): Html<Msg> {
  return {
    type: 'Text',
    text,
  };
}

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
export const div = createTagFunction('div');
export const span = createTagFunction('span');
export const h1 = createTagFunction('h1');
export const h2 = createTagFunction('h2');
export const h3 = createTagFunction('h3');
export const h4 = createTagFunction('h4');
export const h5 = createTagFunction('h5');
export const h6 = createTagFunction('h6');
export const button = createTagFunction('button');
export const input = createTagFunction('input');

// HTML Attribute factory functions

function createAttrFunction<Value extends string | number | boolean>(
  name: string
) {
  return function (value: Value): Attr {
    return attr(name, value);
  };
}

export function attr(name: string, value: string | number | boolean): Attr {
  return {
    type: 'Attr',
    name,
    value,
  };
}

export const className = createAttrFunction<string>('class');

// HTML Event factory functions

function createEvtFunction(name: string) {
  return function <Msg>(msg: Msg): Evt<Msg> {
    return on(name, msg);
  };
}

export function on<Msg>(name: string, msg: Msg): Evt<Msg> {
  return {
    type: 'Evt',
    name,
    msg,
  };
}

export const onClick = createEvtFunction('click');

// Utils

export function isEvent<Msg>(attr: Attribute<Msg>): attr is Evt<Msg> {
  return attr.type === 'Evt';
}

export function isAttr<Msg>(attr: Attribute<Msg>): attr is Attr {
  return attr.type === 'Attr';
}
