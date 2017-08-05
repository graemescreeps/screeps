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

    protected moveToOpts : MoveToOpts = {
         visualizePathStyle: {stroke: '#ffffff'},
         reusePath : 1
    };

    protected getEnergyFromCurrentTargetBehaviour() {
        if (!this.creep.memory.energyTargetId)
            return false;
        
        var target = Game.getObjectById(this.creep.memory.energyTargetId);

        if (target && (<Resource>target).amount > 0) {
            if(this.creep.pickup(<Resource>target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(<Resource>target, this.moveToOpts);
            }
            return true
        }

        if (target && (<Container>target).store[RESOURCE_ENERGY] < this.creep.carryCapacity) {
            if (this.creep.withdraw(<Container>target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(<Container>target, this.moveToOpts)
            }
            if (Object.values(this.creep.carry).reduce((sum, v) => sum += v, 0) == this.creep.carryCapacity)
                this.creep.memory.energyTargetId = undefined;
            return true
        }
           
        this.say(`Deleted ⚡ target`)
        this.creep.memory.energyTargetId = undefined;
        return false;
    }

    protected getEnergyFromNewTargetBehaviour() {        
        let energy = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter : (r : Resource) => r.resourceType === RESOURCE_ENERGY
                && !Object.values(Memory.creeps).some(c=>c.energyTargetId === r.id)
        }) as Resource;

        if (energy) {
            this.creep.memory.energyTargetId = energy.id;
            if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(energy, this.moveToOpts);
            }

            return true;
        }

        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s : Structure) => s.structureType == STRUCTURE_CONTAINER
                        && (s as Container).store[RESOURCE_ENERGY] >= this.creep.carryCapacity
                        && !Object.values(Memory.creeps).some(c=>c.energyTargetId === s.id)
        }) as Container;
            
        if (container) {
            this.creep.memory.energyTargetId = container.id;
            if (this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(container, this.moveToOpts)
            }
            return true;
        }

        return false;
    }

    protected findDroppedEnergyBehaviour() : Boolean {
        let energy = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter : (r : Resource) => r.resourceType === RESOURCE_ENERGY
        }) as Resource;

        if (!energy)
            return false;

        if(this.creep.pickup(energy) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(energy, this.moveToOpts);
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
            this.creep.moveTo(container, this.moveToOpts)
        }

        return true;
    }

    protected refillEnergyBehaviour() : Boolean {
        let targets = this.creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure : Structure)  => {
                    return (structure.structureType == STRUCTURE_EXTENSION &&  (structure as StructureExtension).energy > this.creep.carryCapacity ||
                        (structure.structureType == STRUCTURE_SPAWN && (structure as StructureSpawn).energy > this.creep.carryCapacity ||
                        (structure.structureType == STRUCTURE_TOWER && (structure as StructureTower).energy > this.creep.carryCapacity ||
                        (structure.structureType == STRUCTURE_CONTAINER) && (structure as StructureContainer).store[RESOURCE_ENERGY] > this.creep.carryCapacity)));
                }
            }) as Array<Structure>;

        if (targets.length > 1) {
            targets.sort((a,b) => 
                this.creep.pos.getRangeTo(a) < this.creep.pos.getRangeTo(b) ? -1
                : this.creep.pos.getRangeTo(a) > this.creep.pos.getRangeTo(b) ? 1
                : 0         
            );
        }

        if (this.creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(targets[0], this.moveToOpts)
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
                this.creep.moveTo(targets[0], this.moveToOpts);
        }

        return true;
    }

    protected log(message : string) : void {
        console.log(`${this.creep.name}: ${message}`);
    }

    protected say(message : string) : void {
        this.creep.say(message);
        console.log(`${this.creep.name} says: ${message}`);
    }
}






