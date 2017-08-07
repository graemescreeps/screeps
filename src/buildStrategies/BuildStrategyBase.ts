export interface IBuildStrategy {
    run() : void;
}

export abstract class BuildStrategyBase implements IBuildStrategy {
    constructor(protected room : Room) {
    }
    
    protected stats : any = {};
    
    get constructionSites() : Array<ConstructionSite> { 
        return this.stats.constructionSites || Object.values(Game.constructionSites).filter(cs => cs.room === this.room );
    }


    get extensions() : Array<Extension> {
        return this.stats.extensions || this.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION } });
    }

    
    abstract run() : void;

    protected log(message : string) : void {
        console.log(`(Build ${this.room.name}): ${message}`);
    }
}






