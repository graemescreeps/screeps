import * as towerStrategyTypes from  "./allTowerStrategies"
import {TowerStrategyBase, ITowerStrategy} from "./TowerStrategyBase" 

export function Create(tower : StructureTower) : ITowerStrategy {
    for (let towerStrategyType of Object.values(towerStrategyTypes)) {
        if (<any>towerStrategyType.canApplyStrategy(tower)) {
            return new towerStrategyType(tower);
        }
    }
}


