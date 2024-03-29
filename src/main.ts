import './style.css';

import * as Tea from './tea/program';
import * as Counter from './counter-basic';
import * as CouterWithEffects from './counter-with-effects';

Tea.sandbox(Counter.init, Counter.update, Counter.view).run(
  document.getElementById('app-sandbox')!
);

Tea.element(
  CouterWithEffects.init,
  CouterWithEffects.update,
  CouterWithEffects.effects,
  CouterWithEffects.view
).run(document.getElementById('app-element')!);
