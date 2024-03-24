import './style.css';

import * as Lem from './lem/program';
import * as Sandbox from './sandbox';
import * as Element from './element';

Lem.sandbox(Sandbox.init, Sandbox.update, Sandbox.view).run(
  document.getElementById('app-sandbox')!
);

Lem.element(Element.init, Element.update, Element.effects, Element.view).run(
  document.getElementById('app-element')!
);
