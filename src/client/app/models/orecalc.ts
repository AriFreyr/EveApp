import { Yield } from './yield';

export class OreCalc {

    constructor(
        public baseyield: number,
        public spacebonus: number,
        public implantbonus: number,
        public reprskill: number,
        public repreffskill: number,
        public oreeffskill: number,
        public oreyield: Yield
    ) { }
}
