export function run(creep : Creep) {
    if(creep.memory.repairing && creep.carry.energy == 0) {
        creep.memory.repairing = false;
        creep.say('🔄 refill');
    }
    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
        creep.memory.repairing = true;
        creep.say('🛠 repair');
    }
    
    var targets = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,  
            { filter : (s : Structure) => s.hits < s.hitsMax / 2 }) as Array<Structure>

    if(creep.memory.repairing && targets && targets.length) {
        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    } else {
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s : Structure) => s.structureType == STRUCTURE_CONTAINER
                                && (s as Container).store[RESOURCE_ENERGY] > 0
        }) as Container;

        if (container) {
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container)
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES) as Array<Source>;
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}
