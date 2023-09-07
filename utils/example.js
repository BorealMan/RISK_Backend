/* 
    Big Picture View Of Game Objects - Data Structures
*/

'https://ourgame.com/83930-dfnsd-sjfd90d9'

const game = {
    continents: [{}],
    territories: [{}],
    players: [{}],
    cards: [{}],
    messages: [{}],
    currentTurn: 1, // playerID
    uuid: "",
}

const continent = {
    id: 1,
    name: "North America",
    player: undefined,
}

const territory = {
    id: 1,
    continent: 1,
    player: undefined, // playerID
    name: "Alaska",
    troops: 0,
    connections: [] // territoryID
}

const player = {
    id: 1,
    username: "",
    troops: 0,
    deployable_troops: 0,
}

const riskCard = {
    id: 1,
    name: "",
    description: "",
}