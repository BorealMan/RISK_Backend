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
    // Current Unix Time
    keys.forEach( key => {
        if (GAMES[key].players.length < 1 || compareTimes(GAMES[key].created_at)) {
            if (DEBUG) console.log(`Deleting Game: ${key}`)
            delete GAMES[key];
        }
    })
    if (DEBUG) console.log()
}


const MAX_GAME_DURATION = 3600 * 6; // 6 Hours In Seconds
function compareTimes(created_at) {
    const d = new Date();
    const t = d.getTime();
    const diff = (t - created_at) / 1000;
    if (DEBUG) console.log(`\nTime Comparison:\nCreated At: ${created_at}\nCurrent Time: ${t}\nDiff: ${diff}\n`)
    if (diff  >= MAX_GAME_DURATION) {
        return true;
    }
    return false;
}

export default GAMES