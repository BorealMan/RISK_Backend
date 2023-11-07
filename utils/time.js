export function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns Current Unix Time In Milli-Seconds
export function GetUnixTime() {
    const d = new Date()
    const t = d.getTime()
    return t
}

// Returns Difference Between Two Times In Seconds - Assumes Earliest Time Is T1
export function UnixTimeDiff(t1, t2, seconds=true) {
    let diff = t2 - t1
    if (seconds) {
        diff /= 1000        
    }
    return diff
}

// Returns Difference Between Past Time And Now
export function UnixTimeSince(time) {
    return UnixTimeDiff(time, GetUnixTime())
}