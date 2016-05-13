import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';

/* Components start */
import { HomeComponent } from './home.component';
import { LoginComponent, CallbackComponent } from './login.component';
import { OrecalcComponent } from './orecalc.component';
/* Components end */

/* Services start */
import { AuthService } from '../services/auth.service';
import { MarketService } from '../services/market.service';
import { ItemService } from '../services/item.service';
/* Services start */

@Component({
    selector: 'eve-app',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        AuthService,
        MarketService,
        ItemService
    ],
    templateUrl: 'app/templates/app.template.html'
})
@RouteConfig([
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    },
    {
        path: '/login/callback',
        name: 'Callback',
        component: CallbackComponent
    },
    {
        path: '/calculators/orecalculator',
        name: 'Orecalculator',
        component: OrecalcComponent
    }
])
export class AppComponent {
    title = 'COLCO';
}
