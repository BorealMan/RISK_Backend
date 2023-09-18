import {Continents, Territories} from '../data/data.js'

const GAMESTATE = {
    'FILLING_LOBBY': 0,
    'STARTING_GAME': 1,
    'PLAYING_GAME': 2,
    'COMPLETED': 3,
}

export class Game {
    nextID = 1; // Used To Assign New Player IDs
    // Game Details
    gameID = undefined
    gameState = undefined;
    // Player
    currentPlayerTurn = 1;
    players = [];
    moveTime = 90; // Seconds
    timeIsUp = false;
    // Data 
    continents = {};
    territories = {};
    // messages = {};

    constructor(gameID) {
        this.gameID = gameID
        this.gameState = GAMESTATE.FILLING_LOBBY
        // Assign By Value - Not Reference
        Object.assign(this.continents, Continents)
        Object.assign(this.territories, Territories)
    }

    /* Player Functionality */
    // Returns Error If Failed, Player Object If Successful
    addPlayer(username) {
        if (this.gameState !== GAMESTATE.FILLING_LOBBY) return {err: "Cannot Add New Players Anymore"}
        if (this.players.length > 6) return {err: "Lobby Is Full"}
        // Validate 
        // Greater than 12 or Less than 1 fails
        if (username.length > 12 || username.length <= 1) {
            return {err: "Invalid Username Length"};
        } 
        // Check Username & ID is Unique
        let err = undefined
        this.players.forEach( player => {
            if (player.username === username) {
                err = {err: `Username ${username} Already In Use`};
            }
        })
        if (err !== undefined) return err
        // Create New Player Object
        let player = {}
        player.id = this.nextID;
        player.username = username;
        player.alive = true;
        player.cards = [];
        player.troops = 10;
        player.deployable_troops = 10;
        this.players.push(player)
        this.nextID++;
        return player
    }

    removePlayer(id) {
        if (this.gameState !== GAMESTATE.FILLING_LOBBY) return {err: "Cannot Remove Players Anymore"}
        if (this.players.length < 1) return {err: "No Players"}
        const index = this.players.findIndex( player => {
            return player.id == id;
        })
        // Not Found Check
        if (index == -1) return {err: "Player Doesn't Exist"}
        // Remove That Player
        this.players.splice(index, 1)
        return true
    }

    removeAllPlayers() {
        this.players = [];
    }

    /* Territory Functionalities */
    assignTerritory(id, playerID) {
        if (id < 1 || id > 42) return {err: "Invalid Territory ID"}
        if (this.players[id-1] === undefined) return {err: "Player Does Not Exist"}
        if (!this.players[id-1].alive) return {err: "Player Is Dead!"}
        this.territories[id-1].player = playerID;
    }

    resetTerritory(id) {
        if (id < 1 || id > 42) return {err: "Invalid Territory ID"}
        this.territories[id-1].player = undefined;
    }

    // Continent Functionalities
    assignContinent(id, playerID) {
        if (id < 1 || id > 6) return {err: "Invalid Continent ID"}
        this.continents[id-1].player = playerID
    }

    resetContinent(id) {
        if (id < 1 || id > 6) return {err: "Invalid Continent ID"}
        this.continents[id-1].player = undefined;
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
        if (this.gameState !== GAMESTATE.PLAYING_GAME) return {err: "Can Only Calculate Continent Owners While Game Is Playing"}
        calculateOwnsContinent(1, 0, 8);  // NA
        calculateOwnsContinent(2, 9, 12); // SA
        calculateOwnsContinent(3, 13, 19);// EU
        calculateOwnsContinent(4, 20, 25);// AF
        calculateOwnsContinent(5, 26, 38);// Asia
        calculateOwnsContinent(6, 39, 42);// AU
    }

    // Pass Which Continent And The Range They Are In
    calculateOwnsContinent(continentID, territoryStartID, territoryEndID) {
        let p_id = this.territories[territoryStartID].player;
        if (p_id === undefined) return 0; // Shouldn't Be Possible
        for (let i = territoryStartID+1;i < territoryEndID;i++) {
            if (p_id !== this.territories[i].player) {
                return resetContinent(continentID)
            }
        }
        return this.assignContinent(continentID, p_id);
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

    // Util
    reset() {
        this.gameState = GAMESTATE.FILLING_LOBBY
        this.players = [];
        // this.messages = {};
        // Assign By Value - Not Reference
        Object.assign(this.continents, Continents)
        Object.assign(this.territories, Territories)
    }
}

export default Game;

