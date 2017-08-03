
    
let creepTypes = {
    worker : [
        [ WORK, CARRY, MOVE ],
        [ WORK, WORK, CARRY, MOVE ],
        [ WORK, WORK, WORK, CARRY, MOVE ],
        [ WORK, WORK, WORK, CARRY, MOVE, MOVE ],
        [ WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE ],
        [ WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE ]
    ],
    courier : [
        [ CARRY, CARRY, MOVE ],
        [ CARRY, CARRY, CARRY, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE ]
    ] 
}

export function run() {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
        }
    }

    for(let room of Object.values(Game.rooms)) {
        console.log(`Room ${room.name} has ${room.energyAvailable} energy`);

        let harvesters = Object.values(Game.creeps).filter(creep => creep.room === room && creep.memory.role == 'harvester');
        console.log(`Harvesters: ${harvesters.length}`);

        let couriers = Object.values(Game.creeps).filter(creep => creep.room === room && creep.memory.role == 'courier');
        console.log(`Couriers: ${couriers.length}`);

        let upgraders = Object.values(Game.creeps).filter(creep => creep.room === room && creep.memory.role == 'upgrader');
        console.log(`Upgraders: ${upgraders.length}`);

        let builders = Object.values(Game.creeps).filter(creep => creep.room === room && creep.memory.role == 'builder');
        console.log(`Builders: ${builders.length}`);

        let repairers = Object.values(Game.creeps).filter(creep => creep.room === room && creep.memory.role == 'repairer');
        console.log(`Repairers: ${repairers.length}`);


        let constructionSites = Object.values(Game.constructionSites).filter(cs => cs.room === room );
        console.log(`Construction Sites: ${constructionSites.length}`);

        let extensions = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION } });
        console.log(`Extensions: ${extensions.length}`);

        let repairTargets = room.find(FIND_MY_STRUCTURES,  { filter : (s : Structure) => s.hits < s.hitsMax / 1.5 }) as Array<Structure>

        let spawns = Object.values(Game.spawns).filter(spawn => spawn.room === room);

        for (let spawn of spawns) {
            var spawnLevel = Math.floor(spawn.energyCapacity / 100) -3;
            var workerType = creepTypes.worker[extensions.length];
            var courierType = creepTypes.courier[extensions.length];

            if(harvesters.length < 3 && harvesters.length <= couriers.length && (spawn.canCreateCreep(workerType) === 0)) {
                let newName = spawn.createCreep(workerType, undefined, {role: 'harvester'});
                console.log(`Spawning new harvester (${workerType}): ${newName}`);
            } else if(couriers.length < (3 + extensions.length) && (spawn.canCreateCreep(workerType) === 0)) {
                let newName = spawn.createCreep(workerType, undefined, {role: 'courier'});
                console.log(`Spawning new courier (${courierType}): ${newName}`);
            } else if ((repairers.length  == 0 || (repairTargets.length * 2) > repairers.length) && (spawn.canCreateCreep(workerType) === 0)) {
                let newName =spawn.createCreep(workerType, undefined, {role: 'repairer'});
                console.log(`Spawning new repairer (${workerType}): ${newName}`);
            } else if (constructionSites.length > 0 && builders.length < upgraders.length && (spawn.canCreateCreep(workerType) === 0)) {
                let newName =spawn.createCreep(workerType, undefined, {role: 'builder'});
                console.log(`Spawning new builder (${workerType}): ${newName}`);
            } else if (spawn.canCreateCreep(workerType) === 0) {
                let newName = spawn.createCreep(workerType, undefined, {role: 'upgrader'});
                console.log(`Spawning new upgrader (${workerType}): ${newName}`);
            }
        }
    }


}


