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

        this.repairSelectedEmergencyTargetBehaviour()
            || this.repairNewEmergencyTargetBehaviour()
            || this.repairSelectedTargetBehaviour()
            || this.repairNewTargetBehaviour()
            || this.repairAnyOtherTargetBehaviour()
            || this.refillEnergyBehaviour();
    } 

    protected repairNewEmergencyTargetBehaviour() : Boolean {
        if (!this.creep.memory.repairing)
            return false;

        var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES,  
                { filter : (s : Structure) => s.structureType == STRUCTURE_RAMPART && s.hits < 10000
                }) as Structure
        
        if (!target) {
            var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES,  
                    { filter : (s : Structure) => (s.structureType == STRUCTURE_WALL && s.hits < 10000)
                            || ((s.structureType == STRUCTURE_TOWER || s.structureType == STRUCTURE_SPAWN) && s.hits < s.hitsMax/10)
                    }) as Structure
        }

        if(!target)
            return false;

        this.say(`🚨🛠 ${target.structureType}`);
        this.creep.memory.emergencyTargetId = target.id;

        if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, this.moveToOpts);
        } 

        return true;
    }


    protected repairSelectedEmergencyTargetBehaviour() : Boolean {
        if (!this.creep.memory.repairing || !this.creep.memory.emergencyTargetId)
            return false;

        let target = Game.getObjectById(this.creep.memory.emergencyTargetId) as Structure;

        if (!target 
                || (target.structureType == STRUCTURE_WALL && target.hits > 25000)
                || (target.structureType == STRUCTURE_RAMPART && target.hits > 50000)
                || (target.structureType == STRUCTURE_TOWER || target.structureType == STRUCTURE_SPAWN) && target.hits > target.hitsMax/4)
            {
            this.creep.memory.emergencyTargetId = undefined;
            return false;
        }

        if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target, this.moveToOpts);
        } 

        return true;
    }

    protected repairSelectedTargetBehaviour() : Boolean {
        if (!this.creep.memory.repairing || !this.creep.memory.targetId)
            return false;

        let target = Game.getObjectById(this.creep.memory.targetId) as Structure;

        if (!target 
             || (target.structureType == STRUCTURE_WALL && target.hits > 150000)
                || (target.structureType == STRUCTURE_RAMPART && target.hits > 150000)
                || (target.structureType == STRUCTURE_TOWER || target.structureType == STRUCTURE_SPAWN) && target.hits == target.hitsMax) {
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

        var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES,  { filter: (s : Structure) =>  
            ((s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < 100000)
            || (!(s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < s.hitsMax / 2)
        }) as Structure;

        if(!target)
            return false;

        this.creep.memory.targetId = target.id;
        this.say(`🛠 ${target.structureType}`);

        if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, this.moveToOpts);
        } 

        return true;
    }

    protected repairAnyOtherTargetBehaviour() : Boolean {
        if (!this.creep.memory.repairing)
            return false;

        var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES,  { filter: (s : Structure) => s.hits < s.hitsMax }) as Structure;

        if(!target)
            return false;

        if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, this.moveToOpts);
        } 

        return true;
    }
}
