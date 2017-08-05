
    
// MOVE 50, WORK 100, CARRY 50, ATTACK 80, RANGED_ATTACK 150, HEAL 250, TOUGH 10, CLAIM 600 

// let creepTypes = {
//     harvester : [
//         [ WORK, WORK, MOVE ], // Level 0 300 energy (WORK, WORK, MOVE = 250)
//         [ WORK, WORK, MOVE, MOVE ], // Level 1, 350 (WORK,WORK, MOVE, MOVE = 350 )
//         [ WORK, WORK, WORK, MOVE, MOVE ], //Level 2 400 etc .... (400)
//         [ WORK, WORK, WORK, MOVE, MOVE, MOVE ], // (450) 
//         [ WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE ], // (500) //
//         [ WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE ], // (550) //
//         [ WORK, WORK, WORK, WORK, WORK, MOVE, MOVE ] // (600) //
//     ],
//     worker : [
//         [ WORK, CARRY, MOVE ], // 250/300
//         [ WORK, CARRY, MOVE, MOVE ], // 250/350
//         [ WORK, WORK, CARRY, MOVE, MOVE ], // 350/400
//         [ WORK, WORK, WORK, CARRY, MOVE, MOVE ], // 450/450
//         [ WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ], // 500/500
//         [ WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE ], // 550/550
//         [ WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 600/600
//         [ WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 650/650
//         [ WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 700/700
//         [ WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE  ], // 750
//         [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 800
//         [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ], // 850
//         [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE,  MOVE, MOVE, MOVE, MOVE ], // 900
//         [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,], //950
//         [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ], // 1000
//         [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ], // 1050
//         [ WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ] // 1100
//     ],
//     courier : [
//         [ CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ], //300
//         [ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//         [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
//     ] 
// }

import * as roomStrategyFactory from "./roomStrategies/RoomStrategyFactory"

export function run() {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
        }
    }

    for(let room of Object.values(Game.rooms)) {
        let roomStrategy = roomStrategyFactory.Create(room);

        if (roomStrategy)
            roomStrategy.run();
        
        // if(harvesters.length ==0 && (spawns[0].canCreateCreep(creepTypes.harvester[0]) === 0)) {
        //     let newName = spawns[0].createCreep([WORK, CARRY, MOVE], undefined, {role: 'harvester'});
        //     console.log(`No Harvesters ! Spawning new emergency harvester: ${newName}`);
        // } else if(harvesters.length > 0 && couriers.length === 0 && (spawns[0].canCreateCreep(creepTypes.courier[0]) === 0)) {
        //     let newName = spawns[0].createCreep([CARRY, CARRY, MOVE, MOVE ], undefined, {role: 'courier'});
        //     console.log(`No Couriers ! Spawning new emergency courier: ${newName}`);
        // }

        // if (room.energyAvailable >= 300 + (extensions.length * 50)) {
        //     for (let spawn of spawns) {
        //         var workerType = creepTypes.worker[creepTypes.worker.length -1 < extensions.length ? creepTypes.worker.length - 1 : extensions.length];
        //         var courierType = creepTypes.courier[creepTypes.courier.length -1 < extensions.length ? creepTypes.courier.length - 1 : extensions.length];
        //         var harvesterType = creepTypes.harvester[creepTypes.harvester.length -1 < extensions.length ? creepTypes.harvester.length -1 : extensions.length];

        //         if(harvesters.length < 2  && (spawn.canCreateCreep(harvesterType) === 0)) {
        //             let newName = spawn.createCreep(harvesterType, undefined, {role: 'harvester'});
        //             console.log(`Spawning new harvester (${harvesterType}): ${newName}`);
        //         } else if((couriers.length < harvesters.length || (couriers.length < upgraders.length && energyCollectable > 300) || energyCollectable > 750) && (spawn.canCreateCreep(courierType) === 0)) {
        //             let newName = spawn.createCreep(courierType, undefined, {role: 'courier'});
        //             console.log(`Spawning new courier (${courierType}): ${newName}`);
        //         } else if (repairTargets.length > 0 && repairers.length <= repairTargets.length/3 && (spawn.canCreateCreep(workerType) === 0)) {
        //             let newName =spawn.createCreep(workerType, undefined, {role: 'repairer'});
        //             console.log(`Spawning new repairer (${workerType}): ${newName}`);
        //         } else if (constructionSites.length > 0 && builders.length <= upgraders.length && (spawn.canCreateCreep(workerType) === 0)) {
        //             let newName =spawn.createCreep(workerType, undefined, {role: 'builder'});
        //             console.log(`Spawning new builder (${workerType}): ${newName}`);
        //         } else if (spawn.canCreateCreep(workerType) === 0) {
        //             let newName = spawn.createCreep(workerType, undefined, {role: 'upgrader'});
        //             console.log(`Spawning new upgrader (${workerType}): ${newName}`);
        //         } else {
        //             console.log("**** Room has max energy but not able to build CREEP *****")
        //         }
        //     }
        // }
    }


}


