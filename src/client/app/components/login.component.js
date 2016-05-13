"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var auth_service_1 = require('../services/auth.service');
var LoginComponent = (function () {
    function LoginComponent(authService) {
        this.authService = authService;
    }
    LoginComponent.prototype.loginWithEveCredentials = function () {
        this.authService.redirectToEveLogin();
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'eve-login',
            template: "\n        <h1>Hello from login</h1>\n        <button (click)=\"loginWithEveCredentials()\">Log in!</button>\n    "
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
var CallbackComponent = (function () {
    function CallbackComponent(authService, routeParams) {
        this.authService = authService;
        this.routeParams = routeParams;
    }
    CallbackComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.code = this.routeParams.get('code');
        this.state = this.routeParams.get('state');
        if (!this.code) {
            return;
        }
        this.authService.validateLoginCode(this.code)
            .subscribe(function (accessObject) { return _this.token = accessObject.access_token; }, function (error) { return _this.error = JSON.stringify(error); });
    };
    CallbackComponent = __decorate([
        core_1.Component({
            selector: 'eve-callback',
            template: "\n        <p>{{code}}:{{state}}</p>\n        <p>{{token}}</p>\n        <p>ERROR: {{error}}\n    "
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, router_deprecated_1.RouteParams])
    ], CallbackComponent);
    return CallbackComponent;
}());
exports.CallbackComponent = CallbackComponent;
//# sourceMappingURL=login.component.js.map