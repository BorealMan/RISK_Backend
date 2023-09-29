/* 
    Default Data Structures
*/
export const Continents = [
    {
        id: 0,
        name: "North America",
        territory_count: 9,
        player: undefined,
        bonus: undefined
    },
    {
        id: 1,
        name: "South America",
        territory_count: 4,
        player: undefined,
    },
    {
        id: 2,
        name: "Europe",
        territory_count: 7,
        player: undefined,
    },
    {
        id: 3,
        name: "Africa",
        territory_count: 6,
        player: undefined,
    },
    {
        id: 4,
        name: "Asia",
        territory_count: 12,
        player: undefined,
    },
    {
        id: 5,
        name: "Australia",
        territory_count: 4,
        player: undefined,
    },
]

export const Territories = [
    // North America
    {
        id: 1,
        continent: 0,
        player: undefined,
        name: "Alaska",
        troops: 0,
        connections: [2, 3, 37]
    },
    {
        id: 2,
        continent: 1,
        player: undefined,
        name: "Northwest Territory",
        troops: 0,
        connections: [1, 3, 4, 9]
    },
    {
        id: 3,
        continent: 1,
        player: undefined,
        name: "Alberta",
        troops: 0,
        connections: [1, 2, 4, 6]
    },
    {
        id: 4,
        continent: 1,
        player: undefined,
        name: "Ontario",
        troops: 0,
        connections: [2, 3, 5, 6, 7, 9]
    },
    {
        id: 5,
        continent: 1,
        player: undefined,
        name: "Quebec",
        troops: 0,
        connections: [4, 7, 9]
    },
    {
        id: 6,
        continent: 1,
        player: undefined,
        name: "Western US",
        troops: 0,
        connections: [3, 4, 7, 8]
    },
    {
        id: 7,
        continent: 1,
        player: undefined,
        name: "Eastern US",
        troops: 0,
        connections: [4, 5, 6, 8]
    },
    {
        id: 8,
        continent: 1,
        player: undefined,
        name: "Central America",
        troops: 0,
        connections: [6, 7, 10]
    },
    {
        id: 9,
        continent: 1,
        player: undefined,
        name: "Greenland",
        troops: 0,
        connections: [2, 4, 5, 14]
    },
    //South America
    {
        id: 10,
        continent: 2,
        player: undefined,
        name: "Venezuela",
        troops: 0,
        connections: [8, 11, 12]
    },
    {
        id: 11,
        continent: 2,
        player: undefined,
        name: "Peru",
        troops: 0,
        connections: [10, 12, 13]
    },
    {
        id: 12,
        continent: 2,
        player: undefined,
        name: "Brazil",
        troops: 0,
        connections: [10, 11, 13, 21]
    },
    {
        id: 13,
        continent: 2,
        player: undefined,
        name: "Argentina",
        troops: 0,
        connections: [11, 12]
    },
    // Europe
    {
        id: 14,
        continent: 3,
        player: undefined,
        name: "Iceland",
        troops: 0,
        connections: [9, 15, 17]
    },
    {
        id: 15,
        continent: 3,
        player: undefined,
        name: "Great Britain",
        troops: 0,
        connections: [14, 16, 17, 18]
    },
    {
        id: 16,
        continent: 3,
        player: undefined,
        name: "Western Europe",
        troops: 0,
        connections: [15, 18, 19, 21]
    },
    {
        id: 17,
        continent: 3,
        player: undefined,
        name: "Scandinavia",
        troops: 0,
        connections: [14, 15, 18, 20]
    },
    {
        id: 18,
        continent: 3,
        player: undefined,
        name: "Northern Europe",
        troops: 0,
        connections: [15, 16, 17, 19, 20]
    },
    {
        id: 19,
        continent: 3,
        player: undefined,
        name: "Southern Europe",
        troops: 0,
        connections: [16, 18, 20, 21, 24, 29]
    },
    {
        id: 20,
        continent: 3,
        player: undefined,
        name: "Ukraine",
        troops: 0,
        connections: [17, 18, 19, 27, 28, 29]
    },
    // Africa
    {
        id: 21,
        continent: 4,
        player: undefined,
        name: "North Africa",
        troops: 0,
        connections: [12, 16, 19, 22, 24, 25]
    },
    {
        id: 22,
        continent: 4,
        player: undefined,
        name: "Congo",
        troops: 0,
        connections: [21, 23, 25]
    },
    {
        id: 23,
        continent: 4,
        player: undefined,
        name: "South Africa",
        troops: 0,
        connections: [22, 25, 26]
    },
    {
        id: 24,
        continent: 4,
        player: undefined,
        name: "Egypt",
        troops: 0,
        connections: [19, 21, 25, 29]
    },
    {
        id: 25,
        continent: 4,
        player: undefined,
        name: "East Africa",
        troops: 0,
        connections: [21, 22, 24, 26, 29]
    },
    {
        id: 26,
        continent: 4,
        player: undefined,
        name: "Madagascar",
        troops: 0,
        connections: [23, 25]
    },
    // Asia
    {
        id: 27,
        continent: 5,
        player: undefined,
        name: "Ural",
        troops: 0,
        connections: [20, 28, 30, 31]
    },
    {
        id: 28,
        continent: 5,
        player: undefined,
        name: "Afghanistan",
        troops: 0,
        connections: [20, 27, 29, 31, 32]
    },
    {
        id: 29,
        continent: 5,
        player: undefined,
        name: "Middle East",
        troops: 0,
        connections: [19, 20, 24, 25, 28, 32]
    },
    {
        id: 30,
        continent: 5,
        player: undefined,
        name: "Siberia",
        troops: 0,
        connections: [27, 31, 33, 34, 35]
    },
    {
        id: 31,
        continent: 5,
        player: undefined,
        name: "China",
        troops: 0,
        connections: [27, 28, 30, 32, 35, 36]
    },
    {
        id: 32,
        continent: 5,
        player: undefined,
        name: "India",
        troops: 0,
        connections: [28, 29, 31, 36]
    },
    {
        id: 33,
        continent: 5,
        player: undefined,
        name: "Yakutsk",
        troops: 0,
        connections: [30, 34, 37]
    },
    {
        id: 34,
        continent: 5,
        player: undefined,
        name: "Irkutsk",
        troops: 0,
        connections: [30, 33, 35, 37]
    },
    {
        id: 35,
        continent: 5,
        player: undefined,
        name: "Mongolia",
        troops: 0,
        connections: [30, 31, 34, 37, 38]
    },
    {
        id: 36,
        continent: 5,
        player: undefined,
        name: "Siam",
        troops: 0,
        connections: [31, 32, 39]
    },
    {
        id: 37,
        continent: 5,
        player: undefined,
        name: "Kamchatka",
        troops: 0,
        connections: [1, 33, 34, 35, 38]
    },
    {
        id: 38,
        continent: 5,
        player: undefined,
        name: "Japan",
        troops: 0,
        connections: [35, 37]
    },
    // Australia
    {
        id: 39,
        continent: 6,
        player: undefined,
        name: "Indoesia",
        troops: 0,
        connections: [36, 40, 41]
    },
    {
        id: 40,
        continent: 6,
        player: undefined,
        name: "Western Australia",
        troops: 0,
        connections: [39, 41, 42]
    },
    {
        id: 41,
        continent: 6,
        player: undefined,
        name: "New Guinea",
        troops: 0,
        connections: [39, 40, 42]
    },
    {
        id: 42,
        continent: 6,
        player: undefined,
        name: "Eastern Australia",
        troops: 0,
        connections: [40, 41]
    },
]
