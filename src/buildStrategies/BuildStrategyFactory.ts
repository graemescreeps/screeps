import * as buildStrategyTypes from  "./allBuildStrategies"
import {BuildStrategyBase, IBuildStrategy} from "./BuildStrategyBase" 

export function Create(room : Room) : IBuildStrategy {
    for (let buildStrategyType of Object.values(buildStrategyTypes)) {
        if (<any>buildStrategyType.canApplyStrategy(room)) {
            return new buildStrategyType(room);
        }
    }
}


