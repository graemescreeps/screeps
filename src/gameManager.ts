
    
// MOVE 50, WORK 100, CARRY 50, ATTACK 80, RANGED_ATTACK 150, HEAL 250, TOUGH 10, CLAIM 600 

let creepTypes = {
    harvester : [
        [ WORK, CARRY, MOVE ], // Level 0 300 energy (WORK, WORK, MOVE = 250)
        [ WORK, WORK, CARRY, MOVE ], // Level 1, 350 (WORK,WORK, CARRY, MOVE = 350 )
        [ WORK, WORK, WORK, CARRY, MOVE ], //Level 2 400 etc .... (400)
        [ WORK, WORK, WORK, CARRY, MOVE, MOVE ], // (450) 
        [ WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ] // (450) //
    ],
    worker : [
        [ WORK, CARRY, MOVE ], // 250/300
        [ WORK, CARRY, MOVE, MOVE ], // 250/350
        [ WORK, WORK, CARRY, MOVE, MOVE ], // 350/400
        [ WORK, WORK, WORK, CARRY, MOVE, MOVE ], // 450/450
        [ WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ], // 500/500
        [ WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE ], // 550/550
        [ WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 600/600
        [ WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 650/650
        [ WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 700/700
        [ WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE  ], // 750
        [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 800
        [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 850
        [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE,  MOVE, MOVE, MOVE, MOVE ], // 900
        [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ], //950
        [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ], // 1000
        [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE  ], // 1050
    ],
    courier : [
        [ CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ], //300
        [ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
        [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
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

        let repairTargets = room.find(FIND_STRUCTURES,  { filter : (s : Structure) => s.hits < s.hitsMax / 1.5 }) as Array<Structure>
        console.log(`Damaged (< 50%) Structures: ${repairTargets.length}`);
        let spawns = Object.values(Game.spawns).filter(spawn => spawn.room === room);

        if (room.energyAvailable >= 300 + (extensions.length * 50)) {
            for (let spawn of spawns) {
                var workerType = creepTypes.worker[creepTypes.worker.length < extensions.length ? creepTypes.worker.length - 1: extensions.length];
                var courierType = creepTypes.courier[creepTypes.courier.length < extensions.length ? creepTypes.courier.length - 1: extensions.length];
                var harvesterType = creepTypes.harvester[creepTypes.harvester.length < extensions.length ? creepTypes.harvester.length -1 : extensions.length];

                if(harvesters.length < 3 && harvesters.length <= couriers.length+1 && (spawn.canCreateCreep(harvesterType) === 0)) {
                    let newName = spawn.createCreep(harvesterType, undefined, {role: 'harvester'});
                    console.log(`Spawning new harvester (${workerType}): ${newName}`);
                } else if(couriers.length < (3 + extensions.length/2) && (spawn.canCreateCreep(courierType) === 0)) {
                    let newName = spawn.createCreep(courierType, undefined, {role: 'courier'});
                    console.log(`Spawning new courier (${courierType}): ${newName}`);
                } else if ((repairers.length  == 0 || (repairers.length) < repairTargets.length/3) && (spawn.canCreateCreep(workerType) === 0)) {
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


}


