import Game from '../game.js'

/* Testing Game Functionalities */
const DEBUG = false;

const g = new Game("56")

// Run Tests Here
TestPlayerFunctionality()

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

    return {err: "Delete Error"}
}
