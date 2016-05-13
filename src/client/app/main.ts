import { bootstrap }    from '@angular/platform-browser-dynamic';
import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode, provide } from '@angular/core';

import { AppComponent } from './components/app.component';

import 'rxjs/Rx';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppComponent, [
    provide(APP_BASE_HREF, { useValue: '<%= APP_BASE %>' })
]);
