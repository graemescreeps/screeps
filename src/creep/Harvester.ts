import { ManagedCreepBase }  from "./ManagedCreepBase"

export class Harvester extends ManagedCreepBase { 
    public run() : void {
        if(this.creep.carry.energy < this.creep.carryCapacity) {
            if (!this.creep.memory.targetSourceId) {
                let lastCreepCount=9999;
                let selectedSource=undefined;

                for (let source  of (this.creep.room.find(FIND_SOURCES) as Array<Source>)) {
                    let count = Object.values(Memory.creeps).filter(m=>m.targetSourceId === source.id).length;
                    if (count >= lastCreepCount) 
                        continue;

                    lastCreepCount = count;
                    selectedSource = source;
                }
                this.creep.memory.targetSourceId = selectedSource.id;
            }

            let source = Game.getObjectById(this.creep.memory.targetSourceId) as Source;
            if(this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            this.creep.memory.targetSourceId=undefined;

            this.noCourierBehavior() || this.deliverToContainerBehaviour() || this.dropBehaviour();
        }
    } 
    
    protected noCourierBehavior() : Boolean {
        let courierCount =  Object.values(Game.creeps).filter(c => c.room === this.creep.room && c.memory.role == 'courier').length;

        if (courierCount > 0)
            return false;

        console.log(`Harvester ${this.creep.name} does not have any couriers, delivering load to structure directly ....`);
       
          let targets = this.creep.room.find(FIND_STRUCTURES, {
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

    protected deliverToContainerBehaviour() : Boolean {
        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s : Structure) => s.structureType == STRUCTURE_CONTAINER
                                    && (s as Container).store[RESOURCE_ENERGY] < (s as Container).storeCapacity
            }) as Container;

        if (!container) 
            return false;
        
        if(this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(container)
        }
        

        return true;
    }

    protected dropBehaviour() : Boolean {
        console.log(`Harvester ${this.creep.name} cannot find empty container, dropping energy on ground ....`);
        this.creep.drop(RESOURCE_ENERGY, this.creep.carryCapacity);

        return true;
    }
}
