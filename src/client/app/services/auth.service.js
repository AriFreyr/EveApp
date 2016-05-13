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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.redirect_uri = 'http://localhost:3000/login/callback';
        this.client_id = 'af53453fb99f4724a3afe77917d48203';
        this.client_secret = 'o5MlqxKbE9BBwJ0jb6CO1oiwqvwMIznCYpAYS23x';
        this.scope = 'publicData';
        this.state = 'test';
        this.login_url = 'https://login.eveonline.com/oauth';
        this.server_url = 'http://localhost:5000';
    }
    AuthService.prototype.redirectToEveLogin = function () {
        window.location.href = this.login_url + "/authorize/?response_type=code&redirect_uri=" + this.redirect_uri + "&client_id=" + this.client_id + "&scope=" + this.scope + "&state=" + this.state;
    };
    AuthService.prototype.validateLoginCode = function (code) {
        if (!code) {
            return;
        }
        return this.http.get(this.server_url + "/token?code=" + code)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AuthService.prototype.getAccessToken = function () {
        return this.token;
    };
    AuthService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        this.token = body.access_token;
        return body || {};
    };
    AuthService.prototype.handleError = function (error) {
        var errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map