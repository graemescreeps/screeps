# Cheatsheet
## Spawn a new creep
```Game.spawns.Spawn1.createCreep(#action_list#, #builder_name#, #memory_hash#);```
```Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], 'Harvester1', {role: 'harvester'});```
```Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], 'Builder1', {role: 'builder'});```
```Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], 'Upgrader1', {role: 'upgrader'});```

## Game status display
```
    if (Game.time % 10 === 0) {
        for(var name in Game.rooms) {
            console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
        }
    }
```