import { CreepStrategyBase }  from "./CreepStrategyBase"

export default class RepairerStrategy  extends CreepStrategyBase { 
    public static canApplyStrategy(creep : Creep) : Boolean { return creep.memory.role ===  "repairer"; }

    public run() : void {
        if(this.creep.memory.repairing && this.creep.carry.energy == 0) {
            this.creep.memory.repairing = false;
            this.creep.say('🔄 ⚡');
        }

        if(!this.creep.memory.repairing && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.repairing = true;
        }

        this.repairSelectedTargetBehaviour()
            || this.repairNewTargetBehaviour
            || this.refillEnergyBehaviour();
    } 
        
    protected repairSelectedTargetBehaviour() : Boolean {
        if (this.creep.memory.repairing || !this.creep.memory.targetId)
            return false;

        let target = Game.getObjectById(this.creep.memory.targetId) as Structure;

        if (!target || target.hits == target.hitsMax) {
            this.creep.memory.targetId = undefined;
            return false;
        }
        if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, this.moveToOpts);
        } 

        return true;
    }

    protected repairNewTargetBehaviour() : Boolean {
        if (!this.creep.memory.repairing)
            return false;

        var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES,  
                { filter : (s : Structure) => s.hits < s.hitsMax / 2 }) as Structure

        if(!target)
            return false;

        this.creep.memory.targetId = target.id;
        this.creep.say(`🛠 ${target.structureType}`);

        if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, this.moveToOpts);
        } 

        return true;
    }
}
