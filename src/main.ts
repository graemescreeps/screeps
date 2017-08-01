import * as gameManager from "./gameManager"
import * as uiManager from "./uiManager"
import * as creepManager from "./creepManager"

import "./shims"

export function loop() {

    if (Game.time % 10 === 0) {
        gameManager.run();
    }

    
    uiManager.run();
    creepManager.run();
}
