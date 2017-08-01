import { IManagedCreep, ManagedCreepBase }  from "./ManagedCreepBase"
import { Builder }  from "./Builder"
import { Harvester }  from "./Harvester"

export function Create(creep : Creep) : IManagedCreep {
    switch (creep.memory.role) {
        case "builder" : 
            return new Builder(creep);
        case "harvester" : 
            return new Harvester(creep);
        default:
            return undefined;
    }
}


