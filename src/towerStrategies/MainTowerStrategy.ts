import { TowerStrategyBase }  from "./TowerStrategyBase"

export default class BuilderStrategy extends TowerStrategyBase { 
    public static canApplyStrategy(tower : Tower) : Boolean { return true; } 
    
    public run() : void {
        this.attackHostileCreepBehavior()
            || this.healCreepBehavior() 
            || this.repairBehaviour();

    }

    protected attackHostileCreepBehavior() : Boolean {    
        let target = this.tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
        if (!target)
            return false;

        this.log(`User ${target.owner.username} spotted - Attacking`);

        return (this.tower.attack(target) === 0);
    }


    protected healCreepBehavior() : Boolean {    
        let target = this.tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (c : Creep) => 
            c.hits < c.hitsMax
        }) as Creep;

        if (!target)
            return false;

        this.log(`🏥 ${target.name}`);

        return (this.tower.heal(target) === 0);
    }

    protected repairBehaviour() : Boolean {    
         if (this.tower.energy < this.tower.energyCapacity / 2 )
            return false;

        var target = this.tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s : Structure) => 
            ((s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL) && s.hits < 10000)
            || (!(s.structureType == STRUCTURE_TOWER || s.structureType == STRUCTURE_SPAWN) && s.hits < s.hitsMax / 2)
        }) as Structure;

        if (!target)
            return false;

        this.tower.repair(target);
        
        return true;
    }
}
