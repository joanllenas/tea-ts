import * as Html from '../../tea/html';

export function view(path: string): Html.Html<any> {
  return Html.div(
    [],
    [
      Html.h1([], [Html.text('Page not found')]),
      Html.text(`Could not found "${path}".`),
    ],
  );
}
