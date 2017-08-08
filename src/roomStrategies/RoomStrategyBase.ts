export interface IRoomStrategy {
    run() : void;
}

export abstract class RoomStrategyBase implements IRoomStrategy {
    constructor(protected room : Room) {
    }
    
    protected stats : any = {};

    get energyCollectable() : number {
        return this.stats.energyCollectable || (this.stats.energyCollectable = (this.room.find(FIND_DROPPED_RESOURCES, 
            { filter: (r : Resource) => r.resourceType == RESOURCE_ENERGY})
            .reduce((sum : number, c : Resource) => c.amount + sum, 0)
        +
            this.room.find(FIND_MY_STRUCTURES, 
            { filter: (s : Structure) => s.structureType == STRUCTURE_CONTAINER})
            .reduce((sum : number, c : Container) => c.store + sum, 0)));
    }

    get creeps() : { [ role : string ] :  Creep[] } { 
        if (this.stats.creeps)
            return this.stats.creeps;
        
        this.stats.creeps = <{[ role : string ] :  Creep[] }> {};
        
        for (var creep of Object.values(Game.creeps).filter(creep => creep.room === this.room)) {
            if (this.stats.creeps[creep.memory.role] === undefined)
                this.stats.creeps[creep.memory.role] = [ creep ]
            else 
                this.stats.creeps[creep.memory.role].push(creep)
        }
        return this.stats.creeps;
    }

    protected creepCount(role : string) {
        return this.creeps[role] === undefined ? 0 : this.creeps[role].length;
    }

    get constructionSites() : Array<ConstructionSite> { 
        return this.stats.constructionSites || Object.values(Game.constructionSites).filter(cs => cs.room === this.room );
    }


    get extensions() : Array<Extension> {
        return this.stats.extensions || this.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION } });
    }

    get repairTargets() : Array<Structure> {
        return this.stats.repairTargets || this.room.find(FIND_STRUCTURES,  { filter : (s : Structure) => 
            ((s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < 100000)
            || (!(s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < s.hitsMax / 2)
        }) as Array<Structure>;
    }
    
    get spawns() : Array<Spawn> {
        return this.stats.spawns || Object.values(Game.spawns).filter(spawn => spawn.room === this.room);
    }

    abstract run() : void;

    protected log(message : string) : void {
        console.log(`(Room ${this.room.name}): ${message}`);
    }

    protected trySpawnCreepFromBuildList(spawn : Spawn, role : string, builds : Array<Array<string>>) : Boolean {
        let build : Array<string> = builds.find(b => spawn.canCreateCreep(b) === 0);

        if (build == undefined)
            return false;

        let nameIndex = (Memory.creepNameIndex[role] = (Memory.creepNameIndex[role] || 0)+1)
        let name = `${role}-${nameIndex}`

        spawn.createCreep(build, name, {role: role} );
        console.log(`Spawning new ${role} (${build}): ${name}`);

        return true;

    }

    protected trySpawnCreep(spawn : Spawn, role : string, build : string[]) : Boolean {
        if (spawn.canCreateCreep(build) !== 0)
            return false;

        let nameIndex = ((Memory.creepNameIndex = Memory.creepNameIndex || {})[role] = (Memory.creepNameIndex[role] || 0)+1)
        let name = `${role}-${nameIndex}`

        if (spawn.createCreep(build, name, {role: role} ) !== 0)
            return false;

        console.log(`Spawning new ${role} (${build}): ${name}`);
        return true;
    }


}






