import { CreepStrategyBase }  from "./CreepStrategyBase"

export default class CourierStrategy  extends CreepStrategyBase { 
    public static canApplyStrategy(creep : Creep) : Boolean { return creep.memory.role ===  "courier"; }

    public run() : void {
        if(this.creep.memory.delivering && this.getRemainingCreepCapacity(this.creep) === this.creep.carryCapacity) {
            this.creep.memory.delivering = false;
            this.creep.say('🔄 ⚡');
        }


        if(!this.creep.memory.delivering && this.getRemainingCreepCapacity(this.creep) === 0) {
            this.creep.memory.delivering = true;
            this.creep.say('📦 ⚡');
        }

        this.courierBehaviour()
            || this.transferEnergyToAdjacentCreepBehaviour()
            || this.findDroppedEnergyBehaviour();     
    } 

    protected courierBehaviour() : Boolean {
        if (!this.creep.memory.delivering)
            return false;

        let targets = this.creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure : Structure)  => {
                    return (structure.structureType == STRUCTURE_EXTENSION &&  (structure as StructureExtension).energy < (structure as StructureExtension).energyCapacity) ||
                        (structure.structureType == STRUCTURE_SPAWN && (structure as StructureSpawn).energy < (structure as StructureSpawn).energyCapacity) ||
                        (structure.structureType == STRUCTURE_TOWER && (structure as StructureTower).energy < (structure as StructureTower).energyCapacity) ||
                        (structure.structureType == STRUCTURE_CONTAINER) && (structure as StructureContainer).store[RESOURCE_ENERGY] < (structure as StructureContainer).storeCapacity;
                }
            }) as Array<Structure>;

        if (targets.length > 1) {
            targets.sort((a , b) =>
                this.creep.pos.getRangeTo(a) < this.creep.pos.getRangeTo(b) ? -1
                : this.creep.pos.getRangeTo(a) > this.creep.pos.getRangeTo(b) ? 1
                : 0         
            );
        }

        for (let t of targets) {
            if (this.creep.transfer(t, RESOURCE_ENERGY) === 0)
                return true;
            
            if (this.creep.moveTo(t, this.moveToOpts) === 0)
                return true;
        }
        
        return false;
    }

    protected transferEnergyToAdjacentCreepBehaviour()
    {
        if (!this.creep.memory.delivering)
            return false;

        let neigbours = this.creep.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: (c : Creep) => c.memory.role !== "harvester" 
                && this.getRemainingCreepCapacity(c) > 0
            }) as Creep[];

        if (!neigbours)
            return false;

        for (let n of neigbours) {
            if (this.creep.transfer(n, RESOURCE_ENERGY)) {
                this.say(`↔ ⚡ ${n.name}`);
            }
        }

        return true;
    }
}
