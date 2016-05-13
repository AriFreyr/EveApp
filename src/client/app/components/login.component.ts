import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { AuthService } from '../services/auth.service';


@Component({
    selector: 'eve-login',
    template: `
        <h1>Hello from login</h1>
        <button (click)="loginWithEveCredentials()">Log in!</button>
    `
})
export class LoginComponent {

    constructor(private authService: AuthService) { }

    loginWithEveCredentials() {
        this.authService.redirectToEveLogin();
    }
}

@Component({
    selector: 'eve-callback',
    template: `
        <p>{{code}}:{{state}}</p>
        <p>{{token}}</p>
        <p>ERROR: {{error}}
    `
})
export class CallbackComponent implements OnInit {
    public code: string;
    public state: string;
    public token: string;
    public error: string;

    constructor(private authService: AuthService, private routeParams: RouteParams ) { }

    ngOnInit() {
        this.code = this.routeParams.get('code');
        this.state = this.routeParams.get('state');

        if (!this.code) {
            return;
        }
        this.authService.validateLoginCode(this.code)
                        .subscribe(
                            accessObject => this.token = accessObject.access_token,
                            error => this.error = JSON.stringify(error)
                        );
    }

}
