import { CreepStrategyBase }  from "./CreepStrategyBase"

export default class UpgraderStrategy  extends CreepStrategyBase { 
    public static canApplyStrategy(creep : Creep) : Boolean { return creep.memory.role ===  "upgrader"; }
    
    public run() : void {
        if(this.creep.memory.upgrading && this.creep.carry.energy == 0) {
            this.creep.memory.upgrading = false;
            this.creep.say('🔄 ⚡');
        }

        if(!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.upgrading = true;
            this.creep.say('🆙');
        }

        this.upgradeBehavior() 
            || this.findContainerEnergyBehaviour() 
            || this.findDroppedEnergyBehaviour();
        
    } 
    
    protected upgradeBehavior() : Boolean {
        if (!this.creep.memory.upgrading) 
            return false;


        if(this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller, this.moveToOpts);
        }  

        return true;
    }
}
