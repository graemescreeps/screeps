export interface ICreepStrategy {
    run() : void;
}

export abstract class CreepStrategyBase implements ICreepStrategy {
    constructor(protected creep : Creep) {
    }

    get memory() : any {
        return this.creep.memory;
    }

    abstract run() : void;

    protected findDroppedEnergyBehaviour() : Boolean {
        let energy = this.creep.pos.findInRange(FIND_DROPPED_RESOURCES, 20, {
            filter : (r : Resource) => r.resourceType === RESOURCE_ENERGY
        }) as Array<Resource>;

        if (!energy.length)
            return false;

        if(this.creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }

        return true;
    }

    protected findContainerEnergyBehaviour() : Boolean {
        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s : Structure) => s.structureType == STRUCTURE_CONTAINER
                                && (s as Container).store[RESOURCE_ENERGY] >= this.creep.carryCapacity
        }) as Container;
            
        if (!container) 
            return false;

        if (this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(container)
        }

        return true;
    }

    protected deliverEnergyToStructureBehaviour() : Boolean {

            let targets = this.creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure : Structure)  => {
                        return (structure.structureType == STRUCTURE_EXTENSION &&  (structure as StructureExtension).energy < (structure as StructureExtension).energyCapacity) ||
                            (structure.structureType == STRUCTURE_SPAWN && (structure as StructureSpawn).energy < (structure as StructureSpawn).energyCapacity) ||
                            (structure.structureType == STRUCTURE_TOWER && (structure as StructureTower).energy < (structure as StructureTower).energyCapacity) ||
                            (structure.structureType == STRUCTURE_CONTAINER) && (structure as StructureContainer).store[RESOURCE_ENERGY] < (structure as StructureContainer).storeCapacity;
                    }
                }) as Array<Structure>;

        if (this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }

        return true;
    }

    protected log(message : string) : void {
        console.log(`${this.creep.name} (${this.creep.memory.role}): ${message}`);
    }

    protected say(message : string) : void {
        this.creep.say(message);
        console.log(`${this.creep.name} (${this.creep.memory.role}) says: ${message}`);
    }
}






