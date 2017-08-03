import { CreepStrategyBase }  from "./CreepStrategyBase"

export default class HarvesterStrategy  extends CreepStrategyBase { 
    public static canApplyStrategy(creep : Creep) : Boolean { return creep.memory.role ===  "harvester"; }

    public run() : void {
        if(this.creep.memory.harvesting && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.harvesting = false;
        }

        if(!this.creep.memory.harvesting && this.creep.carry.energy == 0) {
            this.creep.memory.harvesting = true;
            this.say('⛏️⚡');
        }
        this.harvestFromSelectedSourceBehaviour() 
            || this.harvestFromNewSourceBehaviour()
            || this.noCourierBehavior() 
            || this.deliverToContainerBehaviour() 
            || this.dropBehaviour();
    } 
    
    protected harvestFromSelectedSourceBehaviour() : Boolean {
        if(this.creep.carry.energy >= this.creep.carryCapacity) 
            return false;

        if (!this.creep.memory.targetSourceId)
            return false;

        let source = Game.getObjectById(this.creep.memory.targetSourceId) as Source;

        if (!source) {
            this.creep.memory.targetSourceId = undefined;
            return false;
        }
        if(this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});     
        }

        return true;
    }


    protected harvestFromNewSourceBehaviour() : Boolean {
        if(this.creep.carry.energy >= this.creep.carryCapacity) 
               return false;
        
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

        if(this.creep.harvest(selectedSource) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(selectedSource, {visualizePathStyle: {stroke: '#ffaa00'}});     
        }

        return true;

    }
    protected noCourierBehavior() : Boolean {
        let courierCount =  Object.values(Game.creeps).filter(c => c.room === this.creep.room && c.memory.role == 'courier').length;

        if (courierCount > 0)
            return false;

        this.log(`No couriers - delivering load to structure directly ....`);
       
        return this.deliverEnergyToStructureBehaviour();

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
        this.say(`⬇️ ⚡`);
        this.creep.drop(RESOURCE_ENERGY, this.creep.carryCapacity);

        return true;
    }
}
