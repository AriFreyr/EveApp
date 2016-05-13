import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    private redirect_uri: string = 'http://localhost:3000/login/callback';
    private client_id: string = 'af53453fb99f4724a3afe77917d48203';
    //private client_secret: string ='o5MlqxKbE9BBwJ0jb6CO1oiwqvwMIznCYpAYS23x';
    private scope: string = 'publicData';
    private state: string = 'test';
    private login_url: string = 'https://login.eveonline.com/oauth';
    private server_url: string = 'http://localhost:5000';
    private token: string;

    constructor(private http: Http) { }

    redirectToEveLogin() {
        window.location.href=`${this.login_url}/authorize/?response_type=code&redirect_uri=
        ${this.redirect_uri}&client_id=${this.client_id}&scope=${this.scope}&state=${this.state}`;
    }

    validateLoginCode(code: string) {

        if (!code) {
            return;
        }


        return this.http.get(`${this.server_url}/token?code=${code}`)
                                .map(this.extractData)
                                .catch(this.handleError);
    }

    getAccessToken(): string {
        return this.token;
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
        throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        this.token = body.access_token;
        return body || { };
    }
    private handleError (error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
