/* 
    Default Data Structures
*/
export const Continents = [
    {
        id: 0,
        name: "North America",
        territory_count: 9,
        player: undefined,
        bonus: 5
    },
    {
        id: 1,
        name: "South America",
        territory_count: 4,
        player: undefined,
        bonus: 2
    },
    {
        id: 2,
        name: "Europe",
        territory_count: 7,
        player: undefined,
        bonus: 5
    },
    {
        id: 3,
        name: "Africa",
        territory_count: 6,
        player: undefined,
        bonus: 3
    },
    {
        id: 4,
        name: "Asia",
        territory_count: 12,
        player: undefined,
        bonus: 7
    },
    {
        id: 5,
        name: "Australia",
        territory_count: 4,
        player: undefined,
        bonus: 2
    },
]

export const Territories = [
    // North America
    {
        id: 0,
        continent: 0,
        player: undefined,
        name: "Alaska",
        troops: 0,
        connections: [1, 2, 36]
    },
    {
        id: 1,
        continent: 0,
        player: undefined,
        name: "Northwest Territory",
        troops: 0,
        connections: [0, 2, 3, 8]
    },
    {
        id: 2,
        continent: 0,
        player: undefined,
        name: "Alberta",
        troops: 0,
        connections: [0, 1, 3, 5]
    },
    {
        id: 3,
        continent: 0,
        player: undefined,
        name: "Ontario",
        troops: 0,
        connections: [1, 2, 4, 5, 6, 8]
    },
    {
        id: 4,
        continent: 0,
        player: undefined,
        name: "Quebec",
        troops: 0,
        connections: [3, 6, 8]
    },
    {
        id: 5,
        continent: 0,
        player: undefined,
        name: "Western US",
        troops: 0,
        connections: [2, 3, 6, 7]
    },
    {
        id: 6,
        continent: 0,
        player: undefined,
        name: "Eastern US",
        troops: 0,
        connections: [3, 4, 5, 7]
    },
    {
        id: 7,
        continent: 0,
        player: undefined,
        name: "Central America",
        troops: 0,
        connections: [5, 6, 9]
    },
    {
        id: 8,
        continent: 0,
        player: undefined,
        name: "Greenland",
        troops: 0,
        connections: [1, 3, 4, 13]
    },
    //South America
    {
        id: 9,
        continent: 1,
        player: undefined,
        name: "Venezuela",
        troops: 0,
        connections: [7, 10, 11]
    },
    {
        id: 10,
        continent: 1,
        player: undefined,
        name: "Peru",
        troops: 0,
        connections: [9, 11, 12]
    },
    {
        id: 11,
        continent: 1,
        player: undefined,
        name: "Brazil",
        troops: 0,
        connections: [9, 10, 12, 20]
    },
    {
        id: 12,
        continent: 1,
        player: undefined,
        name: "Argentina",
        troops: 0,
        connections: [10, 11]
    },
    // Europe
    {
        id: 13,
        continent: 2,
        player: undefined,
        name: "Iceland",
        troops: 0,
        connections: [8, 14, 16]
    },
    {
        id: 14,
        continent: 2,
        player: undefined,
        name: "Great Britain",
        troops: 0,
        connections: [13, 15, 16, 17]
    },
    {
        id: 15,
        continent: 2,
        player: undefined,
        name: "Western Europe",
        troops: 0,
        connections: [14, 17, 18, 20]
    },
    {
        id: 16,
        continent: 2,
        player: undefined,
        name: "Scandinavia",
        troops: 0,
        connections: [13, 14, 17, 19]
    },
    {
        id: 17,
        continent: 2,
        player: undefined,
        name: "Northern Europe",
        troops: 0,
        connections: [14, 15, 16, 18, 19]
    },
    {
        id: 18,
        continent: 2,
        player: undefined,
        name: "Southern Europe",
        troops: 0,
        connections: [15, 17, 19, 20, 23, 28]
    },
    {
        id: 19,
        continent: 2,
        player: undefined,
        name: "Ukraine",
        troops: 0,
        connections: [16, 17, 18, 26, 27, 28]
    },
    // Africa
    {
        id: 20,
        continent: 3,
        player: undefined,
        name: "North Africa",
        troops: 0,
        connections: [11, 15, 18, 21, 23, 24]
    },
    {
        id: 21,
        continent: 3,
        player: undefined,
        name: "Congo",
        troops: 0,
        connections: [20, 22, 24]
    },
    {
        id: 22,
        continent: 3,
        player: undefined,
        name: "South Africa",
        troops: 0,
        connections: [21, 24, 25]
    },
    {
        id: 23,
        continent: 3,
        player: undefined,
        name: "Egypt",
        troops: 0,
        connections: [18, 20, 24, 28]
    },
    {
        id: 24,
        continent: 3,
        player: undefined,
        name: "East Africa",
        troops: 0,
        connections: [20, 21, 22, 23, 25, 28]
    },
    {
        id: 25,
        continent: 3,
        player: undefined,
        name: "Madagascar",
        troops: 0,
        connections: [22, 24]
    },
    // Asia
    {
        id: 26,
        continent: 4,
        player: undefined,
        name: "Ural",
        troops: 0,
        connections: [19, 27, 29, 30]
    },
    {
        id: 27,
        continent: 4,
        player: undefined,
        name: "Afghanistan",
        troops: 0,
        connections: [19, 26, 28, 30, 31]
    },
    {
        id: 28,
        continent: 4,
        player: undefined,
        name: "Middle East",
        troops: 0,
        connections: [18, 19, 23, 24, 27, 31]
    },
    {
        id: 29,
        continent: 4,
        player: undefined,
        name: "Siberia",
        troops: 0,
        connections: [26, 30, 32, 33, 34]
    },
    {
        id: 30,
        continent: 4,
        player: undefined,
        name: "China",
        troops: 0,
        connections: [26, 27, 29, 31, 34, 35]
    },
    {
        id: 31,
        continent: 4,
        player: undefined,
        name: "India",
        troops: 0,
        connections: [27, 28, 30, 35]
    },
    {
        id: 32,
        continent: 4,
        player: undefined,
        name: "Yakutsk",
        troops: 0,
        connections: [29, 33, 36]
    },
    {
        id: 33,
        continent: 4,
        player: undefined,
        name: "Irkutsk",
        troops: 0,
        connections: [29, 32, 34, 36]
    },
    {
        id: 34,
        continent: 4,
        player: undefined,
        name: "Mongolia",
        troops: 0,
        connections: [29, 30, 33, 36, 37]
    },
    {
        id: 35,
        continent: 4,
        player: undefined,
        name: "Siam",
        troops: 0,
        connections: [30, 31, 38]
    },
    {
        id: 36,
        continent: 4,
        player: undefined,
        name: "Kamchatka",
        troops: 0,
        connections: [0, 32, 33, 34, 37]
    },
    {
        id: 37,
        continent: 4,
        player: undefined,
        name: "Japan",
        troops: 0,
        connections: [34, 36]
    },
    // Australia
    {
        id: 38,
        continent: 5,
        player: undefined,
        name: "Indoesia",
        troops: 0,
        connections: [35, 39, 40]
    },
    {
        id: 39,
        continent: 5,
        player: undefined,
        name: "Western Australia",
        troops: 0,
        connections: [38, 40, 41]
    },
    {
        id: 40,
        continent: 5,
        player: undefined,
        name: "New Guinea",
        troops: 0,
        connections: [38, 39, 41]
    },
    {
        id: 41,
        continent: 5,
        player: undefined,
        name: "Eastern Australia",
        troops: 0,
        connections: [39, 40]
    },
]
