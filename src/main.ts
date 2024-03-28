import './style.css';

import * as Lem from './tea/program';
import * as Counter from './counter-basic';
import * as CouterWithEffects from './counter-with-effects';

Lem.sandbox(Counter.init, Counter.update, Counter.view).run(
  document.getElementById('app-sandbox')!
);

Lem.element(
  CouterWithEffects.init,
  CouterWithEffects.update,
  CouterWithEffects.effects,
  CouterWithEffects.view
).run(document.getElementById('app-element')!);
