import * as creepStrategyTypes from  "./allCreepStrategies"
import {CreepStrategyBase, ICreepStrategy} from "./CreepStrategyBase" 

export function Create(creep : Creep) : ICreepStrategy {
    for (let creepStrategyType of Object.values(creepStrategyTypes)) {
        if (<any>creepStrategyType.canApplyStrategy(creep)) {
            return new creepStrategyType(creep);
        }
    }
    console.log(`Could not determine strategy for  creep ${creep.name} with role ${creep.memory.role}`);
}


