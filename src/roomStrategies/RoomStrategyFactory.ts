import * as roomStrategyTypes from  "./allRoomStrategies"
import {RoomStrategyBase, IRoomStrategy} from "./RoomStrategyBase" 

export function Create(room : Room) : IRoomStrategy {
    for (let roomStrategyType of Object.values(roomStrategyTypes)) {
        if (<any>roomStrategyType.canApplyStrategy(room)) {
            return new roomStrategyType(room);
        }
    }
    console.log(`Could not determine strategy for room ${room.name} with role ${room.memory.role}`);
}


