import { RoomStrategyBase }  from "./RoomStrategyBase"

export default class BuilderStrategy extends RoomStrategyBase { 
    public static canApplyStrategy(room : Room) : Boolean { return Object.values(Game.spawns).filter(s => s.room === room).length ==1; } 
    
    get spawn() : Spawn {
        return this.spawns[0];
    }

    // MOVE 50, WORK 100, CARRY 50, ATTACK 80, RANGED_ATTACK 150, HEAL 250, TOUGH 10, CLAIM 600 
    protected  builds : { [ role : string ] :  string[][] } = {  
        "harvester" : [      
            [ WORK, WORK, WORK, MOVE, MOVE ],
            [ WORK, WORK, MOVE ]
        ],
        "courier" : [      
            [ CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
        ],
        "builder" : [      
            [ WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE ], // 550
            [ WORK, WORK, CARRY, MOVE, MOVE, MOVE ], // 400
            [ WORK, CARRY, MOVE, MOVE ], // 300
        ],
        "repairer" : [      
            [ WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE ], // 550
            [ WORK, WORK, CARRY, MOVE, MOVE, MOVE ], // 350
            [ WORK, CARRY, MOVE, MOVE ], // 250
        ],
        "upgrader" : [      
            [ WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE ], // 550
            [ WORK, WORK, CARRY, MOVE, MOVE, MOVE ], // 400
            [ WORK, CARRY, MOVE, MOVE ], // 300
        ],
    }

    public run() : void {
        this.log(`Room ${this.room.name} has ${this.room.energyAvailable} energy`);

        this.log(`Construction Sites: ${this.constructionSites.length}`);

        this.log(`Collectable Energy: ${this.energyCollectable}`);

        for (let role of Object.keys(this.creeps)) {
            this.log(`${role}: ${this.creepCount(role)}`);
        }

        this.log(`Extensions: ${this.extensions.length}`);

        this.log(`Damaged (< 50%) Structures: ${this.repairTargets.length}`); 

        if (this.creepCount("harvester") == 0) {
            this.trySpawnCreep(this.spawn, "harvester", [WORK, CARRY, MOVE]);
        } else if (this.creepCount("courier") == 0) {
            this.trySpawnCreep(this.spawn, "courier", [CARRY, MOVE, MOVE]);
        } else if (this.creepCount("harvester") < 4) {
            this.trySpawnCreepFromBuildList(this.spawn, "harvester", this.builds["harvester"]);
        } else if (this.creepCount("courier") < 4) {
            this.trySpawnCreepFromBuildList(this.spawn, "courier", this.builds["courier"]);
        } else if ((this.creepCount("builder") < 4 || this.creepCount("builder") < this.constructionSites.length/10) && this.creepCount("builder") < this.creepCount("upgrader") && this.constructionSites.length > 0) {
            this.trySpawnCreepFromBuildList(this.spawn, "builder", this.builds["builder"]);
        } else if (this.creepCount("repairer") < 4 && this.creepCount("builder") < this.creepCount("upgrader") && this.creepCount("repairer") < this.repairTargets.length/2) {
            this.trySpawnCreepFromBuildList(this.spawn, "repairer", this.builds["repairer"]);
        } else if (this.creepCount("upgrader") < 10) {
            this.trySpawnCreepFromBuildList(this.spawn, "upgrader", this.builds["upgrader"]);
        }
    }

    protected buildNewTargetBehavior() : Boolean {    
        return true;
    }
}
