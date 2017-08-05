import { CreepStrategyBase }  from "./CreepStrategyBase"

export default class CourierStrategy  extends CreepStrategyBase { 
    public static canApplyStrategy(creep : Creep) : Boolean { return creep.memory.role ===  "courier"; }

    public run() : void {
        if(this.creep.memory.delivering && this.creep.carry.energy == 0) {
            this.creep.memory.delivering = false;
            this.creep.say('🔄 ⚡');
        }

        if(!this.creep.memory.delivering && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.delivering = true;
            this.creep.say('📦 ⚡');
        }

        this.courierBehaviour()
            || this.findDroppedEnergyBehaviour();             
    } 

    protected courierBehaviour() : Boolean {
        if (!this.creep.memory.delivering)
            return false;

        return this.deliverEnergyToStructureBehaviour();
    }
}
