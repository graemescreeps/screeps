import { BuildStrategyBase }  from "./BuildStrategyBase"

export default class FlagBuildStrategy extends BuildStrategyBase { 
    public static canApplyStrategy(room : Room) : Boolean { return Object.values(Game.flags).some(f => f.room === room && f.name.startsWith("build:")) } 
    public static allValidStructures : string[] = [ STRUCTURE_CONTAINER, STRUCTURE_CONTROLLER, STRUCTURE_EXTENSION, STRUCTURE_EXTRACTOR, STRUCTURE_KEEPER_LAIR,
            STRUCTURE_LAB, STRUCTURE_LINK, STRUCTURE_NUKER, STRUCTURE_OBSERVER, STRUCTURE_PORTAL, STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN,
            STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_TERMINAL, STRUCTURE_TOWER, STRUCTURE_WALL ];

    get buildFlags() : Array<Flag> { 
        return this.stats.buildFlags || Object.values(Game.flags).filter(f => f.room === this.room && f.name.startsWith("build:"))
    }

    public run() : void {
        for (let flag of this.buildFlags) {
            let buildName = this.parseBuildName(flag.name);
            if (buildName) {
                if (this.room.createConstructionSite(flag.pos.x, flag.pos.y, buildName) === 0) {
                    this.log(`Creating Constuction Site for build:${buildName} at flag at ${flag.pos.x}, ${flag.pos.y}`);
                    flag.remove();
                }
            } else {
                this.log(`Invalid build flag ${flag.name}`);
            }
        }
    }

    protected parseBuildName(flagName : string ) : string {
        let name = flagName.substring(6).replace(/[0-9 ]/g,'');
        return FlagBuildStrategy.allValidStructures.find(s=>s.toLowerCase() == name.toLowerCase()) 
    }
}
