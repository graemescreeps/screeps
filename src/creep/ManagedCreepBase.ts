export interface IManagedCreep {
    run() : void;
}

export abstract class ManagedCreepBase implements IManagedCreep {
    constructor(protected creep : Creep) {
    }

    get memory() : any {
        return this.creep.memory;
    }

    abstract run() : void;

    protected findContainerEnergyBehaviour() : Boolean {
        let energy = this.creep.pos.findInRange(FIND_DROPPED_RESOURCES, 20, {
            filter : (r : Resource) => r.resourceType === RESOURCE_ENERGY
        }) as Array<Resource>;

        if (!energy.length)
            return false;

        if(this.creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            this.log(`Courier ${this.creep.name} picked up dropped energy ...`);
        }

        return true;
    }

    protected findDroppedEnergyBehaviour() : Boolean {
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

    protected log(message : string) : void {
        console.log(message);
    }

    protected say(message : string) : void {
        this.creep.say(message);
    }
}






