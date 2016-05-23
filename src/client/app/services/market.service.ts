import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MarketService {

    server_url: string = 'https://crest-tq.eveonline.com';
    ore_index_start: number = 28385;
    ore_index_end: number = 28432;
    constructor(private http: Http) { }


    getOrePrices(regionId: string) {
        let obsArr: any[] = new Array<any>();
        for (var i = this.ore_index_start; i <= this.ore_index_end; i++) {
            obsArr.push(this.http.get(`${this.server_url}/market/${regionId}/orders/sell/?type=${this.server_url}/types/${i}/`)
                .map(this.extractData)
                .catch(this.handleError));
        }
        return Observable.forkJoin(
            obsArr
        );

    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
        throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || { };
    }
    private handleError (error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
