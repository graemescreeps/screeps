import * as gameManager from "./gameManager"
import * as uiManager from "./uiManager"
import * as CreepStrategyFactory from "./creepStrategies/CreepStrategyFactory"

import "./shims"

export function loop() {

    if (Game.time % 3 === 0) {
        gameManager.run();
    }
    uiManager.run();

    for(var name in Game.creeps) {
        var creepStrategy = CreepStrategyFactory.Create(Game.creeps[name]);  

        if (creepStrategy) {
            creepStrategy.run();
        } 
    }
}
