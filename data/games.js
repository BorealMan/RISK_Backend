/* 
    This Object Will Be A Singleton
    Which Holds All The Games In Memory
    Stored As UUID -> Game
    
    Import This Object To Interact With A Game
*/

// import { GAMESTATE } from '../game/game.js'
import { GetUnixTime, UnixTimeDiff } from "../utils/time.js";

export const GAMES = {}

const DEBUG = true;
const MAX_GAME_DURATION = 21600; // 6 Hours In Seconds

export async function RemoveDeadGames() {
    if (DEBUG) console.log('Running: Remove Dead Games Process')
    const keys = Object.keys(GAMES)
    if (DEBUG) console.log(keys)
    // Define Now In Unix Time
    const now = GetUnixTime()
    // Current Unix Time
    keys.forEach( key => {
        if (GAMES[key].players.length < 1 || compareTimes(GAMES[key].created_at, now)) {
            if (DEBUG) console.log(`Deleting Game: ${key}`)
            delete GAMES[key];
        }
    })
    if (DEBUG) console.log()
}



function compareTimes(created_at, now) {
    const diff = UnixTimeDiff(created_at, now)
    if (DEBUG) console.log(`\nTime Comparison:\nCreated At: ${created_at}\nCurrent Time: ${now}\nDiff: ${diff}\n`)
    if (diff  >= MAX_GAME_DURATION) {
        return true;
    }
    return false;
}

export default GAMES