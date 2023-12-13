import { GetUnixTime, UnixTimeSince, Sleep } from '../utils/time.js';

import { Continents, Territories } from '../data/data.js'

export const GAMESTATE = {
    'FILLING_LOBBY': 0,
    'STARTING_GAME': 1,
    'PLAYING_GAME': 2,
    'COMPLETED': 3,
}

export const PLAYER_TURN_STATE = {
    'NOT_TURN': 0,
    'DRAFT': 1,
    'ATTACK': 2,
    'REINFORCE': 3,
}

export const PLAYER_EVENTS = {
    'DEPLOY_TROOPS': 0,
    'ATTACK': 1,
    'NEXT_PHASE': 2,
    'REINFORCE': 3,
}

export const ANIMATION_EVENTS = {
    'ATTACK_FROM_SELECTED': 0,
}

export class Game {
    next_id = 0; // Used To Assign New Player IDs
    total_turns = 0;
    // Game Details
    game_id = undefined
    game_state = undefined;
    // Player
    current_player_turn = 0;
    players = [];
    player_turn_max_duration = 70; // Seconds
    current_turn_start = undefined
    // Data 
    continents = [];
    territories = [];
    created_at = undefined
    AVAILABLE_COLORS = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"];

    constructor(game_id) {
        this.game_id = game_id
        this.game_state = GAMESTATE.FILLING_LOBBY
        // Assign By Value - Not Reference
        Object.assign(this.continents, Continents)
        Object.assign(this.territories, Territories)
        // Unix Timestamp
        this.created_at = GetUnixTime();
    }

    /* Player Functionality */
    // Returns Error If Failed, Player Object If Successful
    addPlayer(username, socketid) {
        try {
            if (this.game_state !== GAMESTATE.FILLING_LOBBY) return { err: "Cannot Add New Players Anymore" }
            if (this.players.length > 6) return { err: "Lobby Is Full" }
            if (socketid === undefined) return {err: "Error Setting Socket"}
            // Validate 
            // Greater than 12 or Less than 1 fails
            if (username.length > 12 || username.length <= 1) {
                return { err: "Invalid Username Length" };
            }
            // Check Username & ID is Unique
            let err = undefined
            this.players.forEach(player => {
                if (player.username === username) {
                    err = { err: `Username ${username} Already In Use` };
                }
            })
            if (err !== undefined) return err
    
            // Assign unique colors
            const colorIndex = Math.floor(Math.random() * this.AVAILABLE_COLORS.length);
            const color = this.AVAILABLE_COLORS.splice(colorIndex, 1)[0];
    
            // Create New Player Object
            let player = {}
            player.id = this.next_id;
            player.socketid = socketid
            player.username = username;
            player.party_leader = false;
            player.color = color;
            player.alive = true;
            player.cards = [];
            player.troops = 20;
            player.deployable_troops = 20;
            player.territories = 0
            player.turn_state = PLAYER_TURN_STATE.NOT_TURN
            // Party Leader Logic
            if (this.next_id == 0) {
                player.party_leader = true;
            }
            // Pushing Player
            this.players.push(player)
            this.next_id++;
            return player
        } catch (err) {
            console.log(err)
            return {err: err}
        }
    }

    removePlayer(id) {
        try {
            // if (this.game_state !== GAMESTATE.FILLING_LOBBY) return { err: "Cannot Remove Players Anymore" }
            if (this.players.length < 1) return { err: "No Players" }
            const index = this.players.findIndex(player => {
                return player.id == id;
            })
            // Not Found Check
            if (index == -1) return { err: "Player Doesn't Exist" }
            // Add Colors Back
            this.AVAILABLE_COLORS.push(this.players[index].color);
            // Remove The Player
            this.players.splice(index, 1);
            // Reassign Player IDs
            this.players.forEach((player, i) => {
                player.id = i;
                player.party_leader = false;
            });
            // Reassign Party Leader if Lobby Not Empty
            if (this.players.length > 0) this.players[0].party_leader = true;
            this.next_id = this.players.length
            return true
        } catch(err) {
            console.log(err)
            return {err: err}
        }
    }

    playerDisconnected(socketid) {
        for (const player of this.players) {
            if (player.socketid == socketid) {
                const tmp = player.id
                this.removePlayer(player.id)
                return tmp
            }
        }
    }

    removeAllPlayers() {
        this.players = [];
    }

    Update() {
        this.countPlayerTerritories()
        this.calculateOwnsContinents()
    }

    /* Territory Functionalities */
    assignTerritory(id, playerID) {
        if (id < 0 || id > 41) return { err: "Invalid Territory ID" }
        if (this.players[id] === undefined) return { err: "Player Does Not Exist" }
        if (!this.players[id].alive) return { err: "Player Is Dead!" }
        this.territories[id].player = playerID;
    }

    isTerritoryConnected(t_index1, t_index2) {
        const territory = this.territories[t_index1]
        console.log(territory.connections)
        for (let i = 0; i < territory.connections.length; i++) {
            if (t_index2 == territory.connections[i]) {
                return true
            }
        }
        return false
    }

    // Before Start Of Game, Assign Each Territory and All Player Troops To A Territory
    randomlyAssignTerritories() {
        const territories = Array.from(Array(42).keys())
        let p_index = 0;
        // Select Random Territory Until None Left
        // Select Players In Order and Put One Troop On Territory
        while(territories.length > 0) {
            const player = this.players[p_index]
            // Get A Territory ID
            const index = Math.floor(Math.random() * territories.length);
            const t_index = territories.splice(index, 1)
            const territory = this.territories[t_index]
            // Assign Territory
            territory.player = player.id
            territory.troops = 1
            // Adjust Values
            player.deployable_troops -= 1
            p_index = (p_index + 1) % this.players.length
        }
        this.players.forEach( player => {
            // Get All Territories Owned
            const territoriesOwned = []
            this.territories.forEach( (t, i) => {
                if (t.player == player.id) {
                    territoriesOwned.push(i)
                }
            })
            // console.log(territoriesOwned)
            // Assign Troops Randomly To Territory Until None Left
            while(player.deployable_troops > 0) {
                const index = Math.floor(Math.random() * territoriesOwned.length)
                const t_index = territoriesOwned[index]
                const territory = this.territories[t_index]
                territory.troops += 1
                player.deployable_troops -= 1
            }
        })
    }

    countPlayerTerritories() {
        this.players.forEach( player => {
            player.territories = 0
        })
        this.territories.forEach( territory => {
            this.players[territory.player].territories += 1
        })
    }

    resetTerritory(id) {
        if (id < 0 || id > 42) return { err: "Invalid Territory ID" }
        this.territories[id].player = undefined;
    }

    // Continent Functionalities
    assignContinent(id, playerID) {
        if (id < 0 || id > 5) return { err: "Invalid Continent ID" }
        this.continents[id].player = playerID
    }

    resetContinent(id) {
        if (id < 0 || id > 5) return { err: "Invalid Continent ID" }
        this.continents[id].player = undefined;
    }

    /*  
        Loop Through Territories And Check If A Player 
        Owns All Territories In One Of The Continents 

        Ranges:
            North America: 1  -  9
            South America: 10 - 13
            Europe:        14 - 20
            Africa:        21 - 26
            Asia:          27 - 38
            Australia      39 - 42
    */
    calculateOwnsContinents() {
        if (this.game_state !== GAMESTATE.PLAYING_GAME) return { err: "Can Only Calculate Continent Owners While Game Is Playing" }
        this.calculateOwnsContinent(0, 0, 8);  // NA
        this.calculateOwnsContinent(1, 9, 12); // SA
        this.calculateOwnsContinent(2, 13, 19);// EU
        this.calculateOwnsContinent(3, 20, 25);// AF
        this.calculateOwnsContinent(4, 26, 38);// Asia
        this.calculateOwnsContinent(5, 39, 42);// AU
    }

    // Pass Which Continent And The Range They Are In
    calculateOwnsContinent(continentID, territoryStartID, territoryEndID) {
        // console.log(`Owns Continent ${continentID} Start: ${territoryStartID} End: ${territoryEndID}`)
        // Get Owner Of First Territory
        let p_id = this.territories[territoryStartID].player;
        for (let i = territoryStartID; i < territoryEndID; i++) {
            if (p_id !== this.territories[i].player) {
                return this.resetContinent(continentID)
            }
        }
        return this.assignContinent(continentID, p_id);
    }

    /* Printing Functions */
    printPlayers() {
        this.players.forEach(player => {
            console.log(player);
        })
    }

    printTerritories() {
        this.territories.forEach(territory => {
            console.log(territory)
        })
    }

    printContinents() {
        this.continents.forEach(c => {
            console.log(c)
        })
    }

    // Util
    reset() {
        this.game_state = GAMESTATE.FILLING_LOBBY
        this.players = [];
        // Assign By Value - Not Reference
        Object.assign(this.continents, Continents)
        Object.assign(this.territories, Territories)
    }

    /* 
        Game Logic
            Flow: 

    */

    // Sends Updated Game State To Clients
    SendUpdateGameState() {
        this.Update()
        this.GameServer.to(this.game_id).emit('update_game_state', {
            players: this.players,
            territories: this.territories,
            continents: this.continents,
            game_state: this.game_state,
        })
    }

    CurrentPlayerTurnTimedOut() {
        const diff = UnixTimeSince(this.current_turn_start)
        if (diff > this.player_turn_max_duration) {
            return true;
        }
        // Send Seconds Into Turn
        this.GameServer.to(this.game_id).emit('increment_timer', {seconds: diff})
        return false;
    }

    playerRewardNewTroops() {
        const player = this.players[this.current_player_turn]
        // Default Troop Reward
        let newTroops = Math.max(Math.floor(player.territories / 3), 3)
        // Continent Troop Reward 
        this.continents.forEach( c => {
            if (c.player == player.id) {
                newTroops += c.bonus
            }
        })
        // Update Player Values And Send
        this.players[this.current_player_turn].deployable_troops += newTroops
        this.players[this.current_player_turn].troops += newTroops
        this.GameServer.to(this.game_id).emit('reward_troops', {players: this.players, reward: newTroops})
    }

    IncrementTurn() {
        // Increment Player Turn
        this.players[this.current_player_turn].turn_state = PLAYER_TURN_STATE.NOT_TURN;

        this.current_player_turn = (this.current_player_turn + 1) % this.players.length
        this.players[this.current_player_turn].turn_state = PLAYER_TURN_STATE.DRAFT;
        this.current_turn_start = GetUnixTime();
        // Reset Seconds Into Turn
        this.GameServer.to(this.game_id).emit('increment_timer', {seconds: 0})
        this.GameServer.to(this.game_id).emit('increment_turn', {current_player_turn: this.current_player_turn})
        this.playerRewardNewTroops();
    }

    ProcessTurn() {
        // If Player Is Over Maximum Turn Duration
        if (this.CurrentPlayerTurnTimedOut()) {
            this.IncrementTurn()
        }
    }

    RollDice(n) {
        return Math.floor(Math.random() * n);
    }

    Battle(attacking_troops, defending_troops) {
        const total_rolls = Math.max(attacking_troops, defending_troops)

    
        const attackers_roll = this.RollDice()
        const defenders_roll = this.RollDice()
        
        const attacker_wins = attackers_roll > defenders_roll
    }

    Blitz(attacking_territory, defending_territory, attacking_troops) {
        const attacking_player = this.players[attacking_territory.player]
        const defending_player = this.players[defending_territory.player]
        let defending_troops = defending_territory.troops
        console.log(`Blitz\nAttacking Troops: ${attacking_troops}\nDefending Troops: ${defending_troops}`)

        // Remove Attacking Troops From Current Territory
        attacking_territory.troops -= attacking_troops
        // Number of Troops To Gaurantee A Win
        const attackingTroopsNeeded = Math.ceil(defending_troops / .4167) + 1
        const gauranteedAttackerWin = attacking_troops >= attackingTroopsNeeded

        console.log(`Attacking Troops Needed: ${attackingTroopsNeeded} - Gauranteed Attacker Wins: ${gauranteedAttackerWin}`)

        let attacker_losses = 0
        let defender_losses = 0
        while(true) {
            console.log(`Battle Results: Attacking: ${attacking_troops} Defending: ${defending_troops}`)
            console.log(`Attacking Losses: ${attacker_losses} Defending Losses: ${defender_losses}`)
            const roll = this.RollDice(10000)
            console.log(`Blitz Roll: ${roll}`)
            // Defender Wins Roll
            if (roll > 4167) {
                attacking_troops--;
                attacker_losses++;
            }
            // Attacker Wins Roll
            else {
                defending_troops--;
                defender_losses++;
            }
            //  Attacker Wins
            if (defending_troops <= 0) {
               defending_territory.player = attacking_player.id
               defending_territory.troops = attacking_troops
               attacking_player.troops -= attacker_losses
               defending_player.troops -= defender_losses
               return 
            }
            // Defender Wins
            if (attacking_troops <= 0) {
                if (gauranteedAttackerWin) {
                    defending_territory.player = attacking_player.id
                    defending_territory.troops = 1
                    defending_player.troops -= defending_troops
                    attacking_player.troops -= attacker_losses - 1
                    return
                }
                // Adjust Troops
                defending_territory.troops -= defender_losses
                defending_player.troops -= defender_losses
                attacking_player.troops -= attacker_losses
                return
            }
        }
    }

    // Reinforce Functions
    // BFS Search, Finds A Valid Path Between Territories
    CalculateReinforcePath(player_id, from_territory, to_territory, visited=[]) {
        console.log(`CalculateReinforcePath: from: ${from_territory} to ${to_territory} visited: ${visited}`)
        visited.push(from_territory)
        const f_territory = this.territories[from_territory]
        // const t_territory = this.territories[to_territory]
        let result = false
        for(let conn of f_territory.connections) {
            console.log(`Compare connection ${conn} to ${to_territory}`)
            if (this.territories[conn].player !== player_id) {
                console.log(`Player Doesn't Own: ${conn}`)
                continue;
            }
            if (conn == to_territory) {
                console.log(`Complete!`)
                // visited.push(to_territory)
                return [true, visited]
            }
            const search = visited.find(element => element == conn) 
            // console.log(`Search: ${search}`)
            if (search == undefined) {
                result = this.CalculateReinforcePath(player_id, conn, to_territory, visited)
                if (result) break;
            }
        }
        return result
    }  

    /* 
        Payload = {
            PlayerId,
            Type,
            Data: {
                ...
            }
        }
    */    
    playerEvent(payload) {
        console.log(`New Player Event: ${JSON.stringify(payload)}`)

        if (payload.type == PLAYER_EVENTS.DEPLOY_TROOPS) {
            const player = this.players[payload.player_id]
            const territory = this.territories[payload.territory_id]
            if (payload.deploy_troops <= player.deployable_troops && territory.player == player.id) {
                territory.troops += payload.deploy_troops
                player.deployable_troops -= payload.deploy_troops
                return this.SendUpdateGameState();
            }
        } 
        else if (payload.type == PLAYER_EVENTS.ATTACK) {
            const player = this.players[payload.player_id]
            const attack_from_territory = this.territories[payload.attack_from]
            const attack_to_territory = this.territories[payload.attack_to] 
            // Troops
            const attacking_troops = payload.attacking_troops
            // Checks And Returns Error
            if (!this.isTerritoryConnected(payload.attack_to, payload.attack_from)) {
                console.log(`Err: Territories Not Connected: ${payload.attack_to} - ${payload.attack_from}`)
                return {err: "Territories Not Connected"}
            }
            if (player.id != attack_from_territory.player) {
                console.log(`Err: Attacking Player Doesn't Own Territory`)
                return {err: "Attacking Player Doesn't Own Territory"}
            }
            if (player.id == attack_to_territory.player) {
                console.log("Err: Player Can't Attack Their Own Territory")
                return {err: "Player Can't Attack Their Own Territory"}
            }
            // Logic
            if(payload.battle) {
                // TODO -- Implement Single Battles
            } else {
                this.Blitz(attack_from_territory, attack_to_territory, attacking_troops)
            }            
            return this.SendUpdateGameState();
        }
        else if (payload.type == PLAYER_EVENTS.REINFORCE) {
            const player = this.players[payload.player]
            const to_territory = this.territories[payload.to]
            const from_territory = this.territories[payload.from]
            if (player.id != to_territory.player || player.id != from_territory.player) {
                console.log(`Err: Player Must Own Both Territories\nPlayer${payload.player} ${to_territory.player} ${to_territory.player}`)
                return {err: "Player Must Own Both Territories"}
            }


        }
        else if (payload.type == PLAYER_EVENTS.NEXT_PHASE) {
            const player = this.players[this.current_player_turn]
            switch(player.turn_state) {
                case PLAYER_TURN_STATE.DRAFT:
                    player.turn_state = PLAYER_TURN_STATE.ATTACK
                    break
                case PLAYER_TURN_STATE.ATTACK:
                    player.turn_state = PLAYER_TURN_STATE.REINFORCE
                    break
                case PLAYER_TURN_STATE.REINFORCE:
                    return this.IncrementTurn() 
            }
            return this.SendUpdateGameState()
        }
    }

    animationEvent(payload) {
        console.log(`New Animation Event: ${payload}`)
    }

    async Run(GameServer) {
        this.GameServer = GameServer
        const FPS = 30 
        const ClockRate =  1000/FPS // ms/FPS
        // Randomly Assign Territories To Players
        this.game_state = GAMESTATE.PLAYING_GAME
        this.randomlyAssignTerritories()
        this.SendUpdateGameState()
        // Set First Players Turn
        this.current_player_turn = this.players.length - 1
        this.IncrementTurn()

        // Game Logic - Game Clock
        while(this.game_state !== GAMESTATE.COMPLETED) {
            if (this.players.length <= 0) break;
            this.ProcessTurn()
            await Sleep(ClockRate)
        }
    }
}

export default Game;

