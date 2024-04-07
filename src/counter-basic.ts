import './style.css';
import * as Message from './tea/message';
import * as Html from './tea/html';

type Model = {
  count: number;
};

type Msg = Message.Msg<'Increment', number> | Message.Msg<'Decrement'>;

const msg: Message.MsgRecord<Msg> = {
  Increment: (n: number) => Message.msg('Increment', n),
  Decrement: () => Message.msg('Decrement'),
};

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
    [Html.className('border padding-lg')],
    [
      Html.h3([], [Html.text('Simple')]),
      Html.button([Html.onClick(() => msg.Increment(2))], [Html.text('+')]),
      Html.button([Html.onClick(() => msg.Decrement())], [Html.text('-')]),
      Html.div([], [Html.text('Count: ' + model.count)]),
    ],
  );
};
