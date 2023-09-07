import {Continents, Territories} from '../data/data.js'

const GAMESTATE = {
    'FILLING_LOBBY': 0,
    'STARTING_GAME': 1,
    'PLAYING_GAME': 2,
    'COMPLETED': 3,
}

export class Game {
    constructor(room_id) {
        this.room_id = room_id
        this.gamestate = GAMESTATE.FILLING_LOBBY
        this.players = []
        // Assign By Reference - Not Value
        this.continents = {}
        this.territories = {}
        Object.assign(this.continents, Continents)
        Object.assign(this.territories, Territories)
    }

    /* Player Functionality */
    // Returns Error If Failed, True If Successful
    addPlayer(username) {
        let id = this.players.length + 1;
        // Validate 
        // Greater than 12 or Less than 1 fails
        if (username.length > 12 || username.length <= 1) {
            return {err: "Invalid Username Length"};
        } 
        // Check Username & ID is Unique
        let err = undefined
        this.players.forEach( player => {
            if (id === player.id) {
                err = {err: `Duplicate Player ID: ${id}`}
            }
            if (player.username === username) {
                err = {err: `Username ${username} Already In Use`};
            }
        })
        if (err !== undefined) return err
        // Create New Player Object
        let player = {}
        player.id = id;
        player.username = username;
        player.troops = 10;
        player.deployable_troops = 10;
        this.players.push(player)
        return true
    }

    removePlayer(id) {
        this.players.pop(id-1)
    }

    /* Territory Functionalities */
    assignTerritory(id, playerID) {
        this.territories[id-1].player = playerID;
    }

    assignContinent(id, playerID) {
        this.continents[id-1].player = playerID
    }

    /* Printing Functions */
    printPlayers() {
        this.players.forEach( player => {
            console.log(player);
        })
    }

    printTerritories() {
        this.territories.forEach( territory => {
            console.log(territory)
        })
    }

    printContinents() {
        this.continents.forEach( c => {
            console.log(c)
        })
    }
}

export default Game;

