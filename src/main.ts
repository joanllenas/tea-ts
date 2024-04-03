import './style.css';

import * as Tea from './tea/program';
import * as Counter from './counter-basic';
import * as CouterWithEffects from './counter-with-effects';
//import * as App from './app';

Tea.simple(Counter.init, Counter.update, Counter.view).run(
  document.getElementById('app-simple')!,
);

Tea.advanced(
  CouterWithEffects.init,
  CouterWithEffects.update,
  CouterWithEffects.effects,
  CouterWithEffects.view,
).run(document.getElementById('app-advanced')!, { initialCount: 4 });

// Tea.advanced(App.init, App.update, App.effects, App.view).run(
//   document.getElementById('app-spa')!,
//   {},
// );
