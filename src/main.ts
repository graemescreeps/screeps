import * as uiManager from "./uiManager"
import * as creepStrategyFactory from "./creepStrategies/CreepStrategyFactory"
import * as roomStrategyFactory from "./roomStrategies/RoomStrategyFactory"
import * as buildStrategyFactory from "./buildStrategies/BuildStrategyFactory"
import * as towerStrategyFactory from "./towerStrategies/TowerStrategyFactory"
import "./shims"

export function loop() {

    if (Game.time % 10 === 0) {
        for(let room of Object.values(Game.rooms)) {
            let roomStrategy = roomStrategyFactory.Create(room);

            if (roomStrategy)
                roomStrategy.run();
        }
    }

    if (Game.time % 10 === 5) {
        for(let room of Object.values(Game.rooms)) {
            let buildStrategy = buildStrategyFactory.Create(room);

            if (buildStrategy)
                buildStrategy.run();
        }
    }

    uiManager.run();

    for(let name in Game.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
            continue;
        }

        var creepStrategy = creepStrategyFactory.Create(Game.creeps[name]);  

        if (creepStrategy) {
            creepStrategy.run();
        } 
    }

    for (let tower of <StructureTower[]>Object.values(Game.structures).filter(s=>s.structureType == STRUCTURE_TOWER)) {
        let towerStrategy = towerStrategyFactory.Create(tower);

        if (towerStrategy)
            towerStrategy.run();
    }
}
