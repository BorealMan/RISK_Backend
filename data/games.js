/* 
    This Object Will Be A Singleton
    Which Holds All The Games In Memory
    Stored As UUID -> Game
    
    Import This Object To Interact With A Game
*/

export const GAMES = {}

const DEBUG = true;

export async function RemoveDeadGames() {
    if (DEBUG) console.log('Running: Remove Dead Games Process')
    const keys = Object.keys(GAMES)
    if (DEBUG) console.log(keys)
    keys.forEach( key => {
        if (GAMES[key].players.length < 1) {
            if (DEBUG) console.log(`Deleting Game: ${key}`)
            delete GAMES[key];
        }
    })
    if (DEBUG) console.log()
}

export default GAMES