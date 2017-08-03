import { CreepStrategyBase }  from "./CreepStrategyBase"

export default class RepairerStrategy  extends CreepStrategyBase { 
    public static canApplyStrategy(creep : Creep) : Boolean { return creep.memory.role ===  "repairer"; }

    public run() : void {
        if(this.creep.memory.repairing && this.creep.carry.energy == 0) {
            this.creep.memory.repairing = false;
            this.creep.say('🔄 refill');
        }
        if(!this.creep.memory.repairing && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.repairing = true;
            this.creep.say('🛠 repair');
        }

        this.repairBehaviour()
            || this.findDroppedEnergyBehaviour() 
            || this.findContainerEnergyBehaviour();
    } 
        
    protected repairBehaviour() : Boolean {
        if (!this.creep.memory.repairing)
            return false;

        var targets = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES,  
                { filter : (s : Structure) => s.hits < s.hitsMax / 2 }) as Array<Structure>

        
        if(!targets || !targets.length)
            return false;

        if (this.creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});
        }

        return true;
    }
}
