import './style.css';
import { Message } from './lem/message';
import * as Html from './lem/html';

type Model = {
  count: number;
};

type Msg = Message<'Increment', number> | Message<'Decrement'>;

export const init = (): Model => ({
  count: 0,
});

export const update = (msg: Msg, model: Model): Model => {
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

export const view = (model: Model): Html.Html<Msg> => {
  return Html.div(
    [Html.className('border-1 padding-xl')],
    [
      Html.h2([], [Html.text('Sandbox')]),
      Html.button(
        [Html.onClick({ name: 'Increment', payload: 2 })],
        [Html.text('+')]
      ),
      Html.button([Html.onClick({ name: 'Decrement' })], [Html.text('-')]),
      Html.div([], [Html.text('Count: ' + model.count)]),
    ]
  );
};
