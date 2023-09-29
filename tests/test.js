import Game from '../game/game.js'

/* Testing Game Functionalities */
const DEBUG = true;

const g = new Game("56")

// Run Tests Here
TestPlayerFunctionality()
TerritoryTests()

// Functions
function TestPlayerFunctionality() {
    const errs = [];
    // Test 1 - Creating Players
    let err = CreatePlayers()
    if (err.err !== undefined) errs.push(err.err)
    // Test 2 - Deleting Players
    err = DeletePlayers()
    if (err.err !== undefined) errs.push(err.err) 
    // Print Results
    if (errs.length == 0) {
        console.log("Passed Player Functionality Tests")
    } else {
        console.log("Failed Player Functionality Tests:")
        errs.forEach( err => {
            console.log(`\t- ${err}`)
        })
    }
}

// Returns Err On Fail
function CreatePlayers() {
    // Create User
    let err = g.addPlayer("Ryan")
    // Create More Users
    g.addPlayer("Caleb")
    g.addPlayer("Alen")
    // Check If Failed To Create - Expected To Pass
    if (err.err !== undefined) {
        return err;
    } 
    // Try To Add Duplicate - Expected To Fail (Returns Err)
    err = g.addPlayer("Alen")
    if (err.err === undefined) {
        return {err: "Expected To Fail - Add Duplicate"}
    }
    // Logging
    if (DEBUG) {
        console.log("Create Test Output:")
        g.printPlayers()
    }
    // Check Expected Output
    if (g.players[0].username !== "Ryan") {
        return {err: "Unexpected User State - Position Is Invalid"};
    }
    return true
}

function DeletePlayers() {
    let before_len = g.players.length;
    if (DEBUG) {
        console.log("Delete Test Output")
        console.log(g.players)
    }
    // Expecting No Error
    let err = g.removePlayer(3)
    if (err !== undefined) return err;

    // Expecting Error
    err = g.removePlayer(3)
    if (err === undefined) return {err: "Expected Delete Error"}

    if (DEBUG) console.log(g.players)
    let after_len = g.players.length;

    if (before_len < after_len) return {err: "Failed To Delete Player"}

    // Delete All Players
    g.removeAllPlayers();
    
    if (g.players.length > 0) return {err: "Failed To Remove All Players"}

    return true
}

// Territory Tests
function TerritoryTests() {
    const errs = [];
    // Create Player And Assign Territory
    g.addPlayer("Ryan")
    g.assignTerritory(1, 1);
    if (g.territories[0].player !== 1) errs.push("Failed To Set Territory")

    // Try To Assign OutSide Of Range - Expected To Fail
    let err = g.assignTerritory(43, 1);
    if (err === undefined) errs.push("Failed To Validate Territory Range");
    err = g.assignTerritory(0, 1);
    if (err === undefined) errs.push("Failed To Validate Territory Range");

    // Try To Assign To Invalid Player - Expected To Fail
    err = g.assignTerritory(2, 1);
    if (err === undefined) errs.push("Failed To Validate Player Exists");

    // Try To Assign To Dead Player - Expected To Fail
    g.players[0].alive = false;
    err = g.assignTerritory(1, 2);
    if (err === undefined) errs.push("Failed To Validate Player Alive");

    // Print Results
    if (errs.length == 0) {
        console.log("Passed Territory Functionality Tests")
    } else {
        console.log("Failed Territory Functionality Tests:")
        errs.forEach( err => {
            console.log(`\t- ${err}`)
        })
    }
    g.reset();
    return true
}

// Continent Tests