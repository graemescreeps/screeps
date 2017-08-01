export function run(creep: Creep) {
    if(creep.carry.energy < creep.carryCapacity) {
        let energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 20, {
            filter : (r : Resource) => r.resourceType === RESOURCE_ENERGY
        }) as Array<Resource>;

        if (energy.length) {
            if(creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                console.log(`Courier ${creep.name} picked up dropped energy ...`);
            }
        } else {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s : Structure) => s.structureType == STRUCTURE_CONTAINER
                                    && (s as Container).store[RESOURCE_ENERGY] >= creep.carryCapacity
            }) as Container;

            if (container) {
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container)
                }
            }
        }
    } else {
        creep.memory.targetSourceId=undefined;
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure : Structure)  => {
                return (structure.structureType == STRUCTURE_EXTENSION &&  (structure as StructureExtension).energy < (structure as StructureExtension).energyCapacity) ||
                    (structure.structureType == STRUCTURE_SPAWN && (structure as StructureSpawn).energy < (structure as StructureSpawn).energyCapacity) ||
                    (structure.structureType == STRUCTURE_TOWER && (structure as StructureTower).energy < (structure as StructureTower).energyCapacity)
            }
        }) as Array<Structure>;

        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}
