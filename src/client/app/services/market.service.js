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
var MarketService = (function () {
    function MarketService(http) {
        this.http = http;
        this.server_url = 'https://crest-tq.eveonline.com/market/10000002/orders/sell/?type=https://public-crest.eveonline.com/types';
        this.ore_index_start = 28385;
        this.ore_index_end = 28432;
    }
    MarketService.prototype.getOrePrices = function () {
        var obsArr = new Array();
        for (var i = this.ore_index_start; i <= this.ore_index_end; i++) {
            obsArr.push(this.http.get(this.server_url + "/" + i + "/").map(this.extractData).catch(this.handleError));
        }
        return Observable_1.Observable.forkJoin(obsArr);
    };
    MarketService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        return body || {};
    };
    MarketService.prototype.handleError = function (error) {
        var errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    MarketService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MarketService);
    return MarketService;
}());
exports.MarketService = MarketService;
//# sourceMappingURL=market.service.js.map