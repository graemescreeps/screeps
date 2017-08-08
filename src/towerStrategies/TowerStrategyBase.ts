export interface ITowerStrategy {
    run() : void;
}

export abstract class TowerStrategyBase implements ITowerStrategy {
    constructor(protected tower : Tower) {
    }
    
    protected stats : any = {};

    abstract run() : void;

    protected log(message : string) : void {
        console.log(`(Tower (${this.tower.room.name}): ${message}`);
    }
}






