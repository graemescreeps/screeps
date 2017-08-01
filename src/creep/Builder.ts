import { ManagedCreepBase }  from "./ManagedCreepBase"

export class Builder extends ManagedCreepBase { 
    public run() : void {
        if(this.creep.memory.building && this.creep.carry.energy == 0) {
            this.creep.memory.building = false;
            this.say('🔄 refill');
        }

        if(!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.building = true;
            this.say('🚧 build');
        }

        this.buildBehavior() || this.findContainerEnergyBehaviour() || this.findDroppedEnergyBehaviour()
        
    } 
    
    protected buildBehavior() : Boolean {
        if (!this.creep.memory.building)
            return false;
        
        let targets : Array<ConstructionSite> = [];

        if (this.creep.memory.targetId) {
            targets = this.creep.room.find(FIND_MY_CONSTRUCTION_SITES, { filter : (cs : ConstructionSite) => cs.id === this.creep.memory.targetId});
            if (!targets.length)
                delete this.creep.memory.targetId;
        }

        if (!targets.length)
            targets = this.creep.room.find(FIND_MY_CONSTRUCTION_SITES);

        if(!targets.length) 
            return false;

        if (targets.length > 1) {
            targets.sort((a,b) => 
                a.structureType === STRUCTURE_EXTENSION && b.structureType !== STRUCTURE_EXTENSION  ? 0
                    : a.structureType === STRUCTURE_CONTAINER && b.structureType !== STRUCTURE_CONTAINER  ? 1
                    : this.creep.pos.getRangeTo(a) < this.creep.pos.getRangeTo(b) ? 2
                    : 3         
            );
            this.creep.memory.targetId = targets[0].id;
        }

        if(this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }

        return true;
    }
}
