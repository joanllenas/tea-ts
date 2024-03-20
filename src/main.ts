import './style.css';
import { Message } from './lem/message';
import * as Html from './lem/html';
import * as Lem from './lem/program';

type Model = {
  count: number;
};

type Msg =
  | Message<{ name: 'Increment'; payload: number }>
  | Message<{ name: 'Decrement' }>;

const init = (): Model => ({
  count: 0,
});

const update = (msg: Msg, model: Model): Model => {
  switch (msg.name) {
    case 'Increment': {
      return { count: model.count + msg.payload };
    }
    case 'Decrement': {
      return { count: model.count - 1 };
    }
  }
};

const view = (model: Model): Html.Html<Msg> => {
  return Html.node(
    'div',
    [],
    [
      Html.node(
        'button',
        [Html.on<Msg>('click', { name: 'Increment', payload: 2 })],
        [Html.text('+')]
      ),
      Html.node(
        'button',
        [Html.on<Msg>('click', { name: 'Decrement' })],
        [Html.text('-')]
      ),
      Html.node('div', [], [Html.text('Count: ' + model.count)]),
    ]
  );
};

Lem.sandbox(init, update, view).run(document.getElementById('app')!);
