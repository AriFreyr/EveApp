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
var _ = require('lodash');
var market_service_1 = require('../services/market.service');
var item_service_1 = require('../services/item.service');
var ore_1 = require('../models/ore');
var orecalc_1 = require('../models/orecalc');
var yield_1 = require('../models/yield');
var OrecalcComponent = (function () {
    function OrecalcComponent(marketService, itemService) {
        this.marketService = marketService;
        this.itemService = itemService;
        this.oresWithYield = new Array();
        this.model = new orecalc_1.OreCalc(50, 0, 0, 0, 0, 0, new yield_1.Yield());
        this.skillLevels = [0, 1, 2, 3, 4, 5];
        this.implantBonus = [0, 2, 4, 6, 8];
        this.spaceBonus = [0, 6, 12];
        this.submitted = false;
    }
    OrecalcComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.marketService.getOrePrices().subscribe(function (data) { _this.marketOres = data; }, function (error) { console.log(error); }, function () {
            _this.itemService.getOreYield().subscribe(function (data) { _this.yields = data; }, function (error) { console.log(error); }, function () { _this.formatData(); });
        });
    };
    OrecalcComponent.prototype.onSubmit = function () {
        var _this = this;
        var efficiency = (this.model.baseyield / 100) * (1 + (this.model.reprskill * 0.03)) * (1 + (this.model.repreffskill * 0.02)) * (1 + (this.model.oreeffskill * 0.02)) * (1 + (this.model.implantbonus / 100)) * (1 + (this.model.spacebonus / 100));
        var constraints = {};
        _.forIn(this.model.oreyield, function (value, key) {
            constraints[key] = { "min": Number(value) };
        });
        var variables = {};
        _(this.oresWithYield).forEach(function (value) {
            variables[value.name] = _this.recalculateYield(value.yield, efficiency);
            variables[value.name].price = value.price;
        });
        var ints = {};
        _(this.oresWithYield).forEach(function (value) {
            ints[value.name] = 1;
        });
        var solverModel = {
            "optimize": "price",
            "opType": "min",
            "constraints": constraints,
            "variables": variables,
            "ints": ints
        };
        this.oreResults = new Array();
        var res = solver.Solve(solverModel, 0.5);
        _.forIn(res, function (value, key) {
            _this.oreResults.push({ "name": key, "value": Math.ceil(value).toLocaleString('de') });
        });
        this.submitted = true;
    };
    OrecalcComponent.prototype.recalculateYield = function (oldYield, efficiency) {
        var result = new yield_1.Yield();
        _.forIn(oldYield, function (value, key) {
            result[key] = Math.floor(value * efficiency);
        });
        return result;
    };
    OrecalcComponent.prototype.formatData = function () {
        var _this = this;
        _(this.marketOres).forEach(function (value) {
            var cheapestItem = _.sortBy(value.items, function (item) { return item.price; })[0];
            if (cheapestItem) {
                var ore = _this.getOreForOreId(cheapestItem.type.id);
                ore.price = cheapestItem.price;
                _this.oresWithYield.push(ore);
            }
        });
    };
    OrecalcComponent.prototype.getOreForOreId = function (id) {
        var result = new ore_1.Ore();
        var yieldInfo = new yield_1.Yield();
        var oreInfo = _.find(this.yields, function (item) { return item.typeId == id; });
        yieldInfo.tritanium = oreInfo.Tritanium;
        yieldInfo.pyerite = oreInfo.Pyerite;
        yieldInfo.mexallon = oreInfo.Mexallon;
        yieldInfo.isogen = oreInfo.Isogen;
        yieldInfo.nocxium = oreInfo.Nocxium;
        yieldInfo.zydrine = oreInfo.Zydrine;
        yieldInfo.megacyte = oreInfo.Megacyte;
        yieldInfo.morphite = oreInfo.Morphite;
        result.id = id;
        result.name = oreInfo.typeName;
        result.volume = oreInfo.volume;
        result.yield = yieldInfo;
        return result;
    };
    OrecalcComponent = __decorate([
        core_1.Component({
            selector: 'eve-orecalculator',
            templateUrl: 'app/templates/orecalc.template.html'
        }), 
        __metadata('design:paramtypes', [market_service_1.MarketService, item_service_1.ItemService])
    ], OrecalcComponent);
    return OrecalcComponent;
}());
exports.OrecalcComponent = OrecalcComponent;
//# sourceMappingURL=orecalc.component.js.map