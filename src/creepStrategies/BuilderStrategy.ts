import { CreepStrategyBase }  from "./CreepStrategyBase"

export default class BuilderStrategy extends CreepStrategyBase { 
    public static canApplyStrategy(creep : Creep) : Boolean { return creep.memory.role ===  "builder"; } 

    public run() : void {
        if(this.creep.memory.building && this.creep.carry.energy == 0) {
            this.creep.memory.building = false;
            this.say('🔄 ⚡');
        }

        if(!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.building = true;
        }

        this.buildCurrentTargetBehavior() 
            || this.buildNewTargetBehavior() 
            || this.refillEnergyBehaviour();
        
    } 
    
    protected buildCurrentTargetBehavior() : Boolean {
        if (!this.creep.memory.building)
            return false;
        
        if (!this.creep.memory.targetId) return false;

        let target = Game.getObjectById(this.creep.memory.targetId) as ConstructionSite;
        if (!target) {
            this.say(`Deleted 🚧 target`)
            delete this.creep.memory.targetId;
            return false;
        }
        if(this.creep.build(target) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target, this.moveToOpts);
        }

        return true;
    }
    
    protected buildNewTargetBehavior() : Boolean {    
        if (!this.creep.memory.building)
            return false;

        let targets = this.creep.room.find(FIND_MY_CONSTRUCTION_SITES) as Array<ConstructionSite>;

        if(!targets.length) {
            this.log(`No new construction sites`)
            return false;
        }

        if (targets.length > 1) {
            targets.sort((a,b) => 
                a.structureType === STRUCTURE_EXTENSION && b.structureType === STRUCTURE_EXTENSION && a.progress > b.progress  ? -1
                : a.structureType === STRUCTURE_EXTENSION && b.structureType === STRUCTURE_EXTENSION && b.progress > a.progress  ? 1
                : a.structureType === STRUCTURE_EXTENSION && b.structureType !== STRUCTURE_EXTENSION  ? -1
                : a.structureType !== STRUCTURE_EXTENSION && b.structureType === STRUCTURE_EXTENSION  ? 1
                : a.structureType === STRUCTURE_TOWER && b.structureType === STRUCTURE_TOWER && a.progress > b.progress  ? -1
                : a.structureType === STRUCTURE_TOWER && b.structureType === STRUCTURE_TOWER && b.progress > a.progress  ? 1
                : a.structureType === STRUCTURE_TOWER && b.structureType !== STRUCTURE_TOWER  ? -1
                : a.structureType !== STRUCTURE_TOWER && b.structureType === STRUCTURE_TOWER  ? 1
                : a.structureType === STRUCTURE_STORAGE && b.structureType === STRUCTURE_STORAGE && a.progress > b.progress  ? -1
                : a.structureType === STRUCTURE_STORAGE && b.structureType === STRUCTURE_STORAGE && b.progress > a.progress  ? 1
                : a.structureType === STRUCTURE_STORAGE && b.structureType !== STRUCTURE_STORAGE  ? -1
                : a.structureType !== STRUCTURE_STORAGE && b.structureType === STRUCTURE_STORAGE  ? 1
                : a.structureType === STRUCTURE_CONTAINER && b.structureType === STRUCTURE_CONTAINER && a.progress > b.progress  ? -1
                : a.structureType === STRUCTURE_CONTAINER && b.structureType === STRUCTURE_CONTAINER && b.progress > a.progress  ? 1
                : a.structureType === STRUCTURE_CONTAINER && b.structureType !== STRUCTURE_CONTAINER  ? -1
                : a.structureType !== STRUCTURE_CONTAINER && b.structureType === STRUCTURE_CONTAINER  ? 1    
                : a.structureType === STRUCTURE_RAMPART && b.structureType === STRUCTURE_RAMPART && a.progress > b.progress  ? -1
                : a.structureType === STRUCTURE_RAMPART && b.structureType === STRUCTURE_RAMPART && b.progress > a.progress  ? 1
                : a.structureType === STRUCTURE_RAMPART && b.structureType !== STRUCTURE_RAMPART  ? -1
                : a.structureType !== STRUCTURE_RAMPART && b.structureType === STRUCTURE_RAMPART  ? 1      
                : this.creep.pos.getRangeTo(a) < this.creep.pos.getRangeTo(b) ? -1
                : this.creep.pos.getRangeTo(a) > this.creep.pos.getRangeTo(b) ? 1
                : 0         
            );
        }

        this.creep.memory.targetId = targets[0].id;
        this.say(`🚧 ${targets[0].structureType}`)
        if(this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(targets[0], this.moveToOpts);
        }

        return true;
    }
}
