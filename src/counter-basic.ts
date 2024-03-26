import './style.css';
import * as Message from './lem/message';
import * as Html from './lem/html';

type Model = {
  count: number;
};

const msg = {
  Increment: (n: number) => Message.msg('Increment', n),
  Decrement: Message.msg('Decrement'),
};

type Msg = ReturnType<typeof msg.Increment> | typeof msg.Decrement;

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
};

export const view = (model: Model): Html.Html<Msg> => {
  return Html.div(
    [Html.className('border-1 padding-xl')],
    [
      Html.h2([], [Html.text('Sandbox')]),
      Html.button([Html.onClick(msg.Increment(2))], [Html.text('+')]),
      Html.button([Html.onClick(msg.Decrement)], [Html.text('-')]),
      Html.div([], [Html.text('Count: ' + model.count)]),
    ]
  );
};
