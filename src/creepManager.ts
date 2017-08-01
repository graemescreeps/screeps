import * as roleUpgrader from "./role/upgrader";
import * as roleRepairer from "./role/repairer";
import * as roleCourier from "./role/courier";
import * as ManagedCreepFactory from "./creep/ManagedCreepFactory"

export function run() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        var managedCreep = ManagedCreepFactory.Create(creep);  

        if (managedCreep) {
            managedCreep.run();
        } else {
            // Legacy Code
        

            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if(creep.memory.role == 'courier') {
                roleCourier.run(creep);
            }
        }
    }
}


