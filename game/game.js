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

export class Game {
    next_id = 0; // Used To Assign New Player IDs
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
            if (this.game_state !== GAMESTATE.FILLING_LOBBY) return { err: "Cannot Remove Players Anymore" }
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

    /* Territory Functionalities */
    assignTerritory(id, playerID) {
        if (id < 0 || id > 41) return { err: "Invalid Territory ID" }
        if (this.players[id] === undefined) return { err: "Player Does Not Exist" }
        if (!this.players[id].alive) return { err: "Player Is Dead!" }
        this.territories[id].player = playerID;
    }

    // Before Start Of Game, Assign Each Territory and All Player Troops To A Territory
    RandomlyAssignTerritories(GameServer) {
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
            console.log(territoriesOwned)
            // Assign Troops Randomly To Territory Until None Left
            while(player.deployable_troops > 0) {
                const index = Math.floor(Math.random() * territoriesOwned.length)
                const t_index = territoriesOwned[index]
                const territory = this.territories[t_index]
                territory.troops += 1
                player.deployable_troops -= 1
            }
        })
        // console.log(this.territories)
        this.calculateOwnsContinents()
        GameServer.to(this.game_id).emit('update_territories', {territories: this.territories, players: this.players, continents: this.continents})
    }

    resetTerritory(id) {
        if (id < 1 || id > 42) return { err: "Invalid Territory ID" }
        this.territories[id - 1].player = undefined;
    }

    // Continent Functionalities
    assignContinent(id, playerID) {
        if (id < 1 || id > 6) return { err: "Invalid Continent ID" }
        this.continents[id - 1].player = playerID
    }

    resetContinent(id) {
        if (id < 1 || id > 6) return { err: "Invalid Continent ID" }
        this.continents[id - 1].player = undefined;
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
        calculateOwnsContinent(0, 0, 8);  // NA
        calculateOwnsContinent(1, 9, 12); // SA
        calculateOwnsContinent(2, 13, 19);// EU
        calculateOwnsContinent(3, 20, 25);// AF
        calculateOwnsContinent(4, 26, 38);// Asia
        calculateOwnsContinent(5, 39, 42);// AU
    }

    // Pass Which Continent And The Range They Are In
    calculateOwnsContinent(continentID, territoryStartID, territoryEndID) {
        let p_id = this.territories[territoryStartID].player;
        if (p_id === undefined) return 0; // Shouldn't Be Possible
        for (let i = territoryStartID + 1; i < territoryEndID; i++) {
            if (p_id !== this.territories[i].player) {
                return resetContinent(continentID)
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
    CurrentPlayerTurnTimedOut(GameServer) {
        const diff = UnixTimeSince(this.current_turn_start)
        if (diff > this.player_turn_max_duration) {
            // Increment Player Turn
            this.players[this.current_player_turn].turn_state = PLAYER_TURN_STATE.NOT_TURN;

            this.current_player_turn = (this.current_player_turn + 1) % this.players.length
            this.players[this.current_player_turn].turn_state = PLAYER_TURN_STATE.DRAFT;
            this.current_turn_start = GetUnixTime();
            // Reset Seconds Into Turn
            GameServer.to(this.game_id).emit('increment_timer', {seconds: 0})
            return true;
        }
        // Send Seconds Into Turn
        GameServer.to(this.game_id).emit('increment_timer', {seconds: diff})
        return false;
    }

    ProcessTurn(GameServer) {
        // If Player Is Over Maximum Turn Duration
        if (this.CurrentPlayerTurnTimedOut(GameServer)) {
            return GameServer.to(this.game_id).emit('increment_turn', {current_player_turn: this.current_player_turn})
        }
    }

    async Run(GameServer) {
        const FPS = 60 
        const ClockRate =  1000/FPS // ms/FPS
        // Set Current Turn Timer
        this.current_turn_start = GetUnixTime();
        // Randomly Assign Territories To Players
        this.RandomlyAssignTerritories(GameServer)
        // Socket Events
        // Game Logic - Game Clock
        while(this.game_state !== GAMESTATE.COMPLETED) {
            this.ProcessTurn(GameServer)
            await Sleep(ClockRate)
        }
    }
}

export default Game;

