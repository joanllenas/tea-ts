import './style.css';
import { Message } from './lem/message';
import * as Html from './lem/html';
import * as Lem from './lem/program';

type Model = {
  count: number;
};

type Msg = Message<'Increment', number> | Message<'Decrement'>;

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
  return model;
};

const view = (model: Model): Html.Html<Msg> => {
  return Html.div(
    [],
    [
      Html.button(
        [Html.on('click', { name: 'Increment', payload: 2 })],
        [Html.text('+')]
      ),
      Html.button([Html.on('click', { name: 'Decrement' })], [Html.text('-')]),
      Html.div([], [Html.text('Count: ' + model.count)]),
    ]
  );
};

Lem.sandbox(init, update, view).run(document.getElementById('app-sandbox')!);
