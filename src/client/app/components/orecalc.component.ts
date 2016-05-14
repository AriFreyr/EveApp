import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { MarketService } from '../services/market.service';
import { ItemService } from '../services/item.service';

import { Ore } from '../models/ore';
import { OreCalc } from '../models/orecalc';
import { Yield } from '../models/yield';

declare var solver: any;


@Component({
    selector: 'eve-orecalculator',
    templateUrl: 'app/templates/orecalc.template.html'
})
export class OrecalcComponent implements OnInit {

    model = new OreCalc(50, 0, 0, 0, 0, 0, new Yield());
    skillLevels = [0, 1, 2, 3, 4, 5];
    implantBonus = [0, 2, 4, 6, 8];
    spaceBonus = [0, 6, 12];
    submitted = false;
    oreResults: any[];
    adjustedPrice: string;

    private marketOres: any[];
    private yields: any[];
    private oresWithYield: Ore[] = new Array<Ore>();


    constructor(private marketService: MarketService, private itemService: ItemService) { }

    ngOnInit() {
        this.marketService.getOrePrices().subscribe(
            data => { this.marketOres = <any[]>data; },
            error => { console.log(error); },
            () => {
                this.itemService.getOreYield().subscribe(
                    data => { this.yields = <any[]>data; },
                    error => { console.log(error); },
                    () => { this.formatData(); }
                );
            }
        );
    }

    onSubmit() {

        let efficiency: number = (this.model.baseyield/100)*(1+(this.model.reprskill*0.03))*
                                    (1+(this.model.repreffskill*0.02))*(1+(this.model.oreeffskill*0.02))*
                                    (1+(this.model.implantbonus/100))*(1+(this.model.spacebonus/100));

        let constraints = <any> { };

        _.forIn(this.model.oreyield, (value, key) => {
            constraints[key] =  <any> { 'min': Number(value) };
        });

        let variables = <any> { };

        _(this.oresWithYield).forEach(value => {
            variables[value.name] = this.recalculateYield(value.yield, efficiency);
            variables[value.name].price = value.price;
        });

        let ints = <any> { };

        _(this.oresWithYield).forEach(value => {
            ints[value.name] = 1;
        });

        var solverModel = <any> {
            'optimize': 'price',
            'opType': 'min',
            'constraints': constraints,
            'variables': variables,
            'ints': ints
        };

        this.oreResults = new Array<any>();

        let res = solver.Solve(solverModel, 0.5);
        _.forIn(res, (value, key) => {
            this.oreResults.push({'name': key, 'value': Math.ceil(value).toLocaleString('de'), 'price': this.getPriceForOre(key) });
        });

        let adjPrice: number = 0;

        _(this.oresWithYield).forEach(value => {
            if (res[value.name]) {
                adjPrice += value.price * res[value.name];
            }
        });

        this.adjustedPrice = Math.ceil(adjPrice).toLocaleString('de');

        this.submitted = true;
    }

    private recalculateYield(oldYield: Yield, efficiency: number): Yield {
        let result: Yield = new Yield();

        _.forIn(oldYield, (value, key) => {
            result[key] = Math.floor(value * efficiency);
        });

        return result;

    }

    private getPriceForOre(name: string): number {
        let ore = _.find(this.oresWithYield, (ore) => { return ore.name === name; });

        if (ore) {
            return ore.price
        }
        return 0;
    }

    private formatData() {
        _(this.marketOres).forEach(value => {
            let cheapestItem: any = _.sortBy(value.items, item => { return (item as any).price; })[0];
            if (cheapestItem) {
                let ore: Ore = this.getOreForOreId(cheapestItem.type.id);
                ore.price = cheapestItem.price;
                this.oresWithYield.push(ore);
            }
        });
    }

    private getOreForOreId(id: number): Ore {

        let result: Ore = new Ore();
        let yieldInfo: Yield = new Yield();

        let oreInfo: any = _.find(this.yields, item => { return item.typeId === id; });

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
    }
}
