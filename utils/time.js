export function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function GetUnixTime() {
    const d = new Date()
    const t = d.getTime()
    return t
}

// Return In MilliSeconds - Assumes First Time Is First
export function UnixTimeDiff(t1, t2, seconds=true) {
    let diff = t2 - t1
    if (seconds) {
        diff /= 1000        
    }
    return diff
}
