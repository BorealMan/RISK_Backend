import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
// Game Imports
import CONFIG from './config.js'
import { randomUUID } from 'crypto'
import { GAMESTATE } from './game/game.js';

// Init Express API
const app = express()
app.use(cors())
app.use(express.json())

// Initalize Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
})

// Game Imports
import Game from './game/game.js'
import { GAMES, RemoveDeadGames } from './data/games.js'

// Testing Socket.io
io.on('connection', (socket) => {
    if (CONFIG.DEBUG) console.log(`A New User Connected\n`)

    socket.on('disconnecting', () => {
        try {
            if (CONFIG.DEBUG) console.log(`Disconnecting\n`)
            // Only If Socket Is In A Game
            if (socket.rooms.size > 1) {
                // Leave The Game - socket.rooms is a set and working with it sucks 
                let index = 0;
                let gameid = undefined
                for (const room of socket.rooms) {
                    if (index == socket.rooms.size-1) {
                        gameid = room
                    }
                    ++index
                }
                const playerid = GAMES[gameid].playerDisconnected(socket.id)
                if (CONFIG.DEBUG) console.log(`Player ${playerid} is leaving game: ${gameid}\n`)
                return io.to(gameid).emit('player_left', { players: GAMES[gameid].players, player_id: playerid });
            }
        } catch(err) {
            if (CONFIG.DEBUG) console.log(`Error: Disconnect: ${err}\n`)
        }
    })

    socket.on('newgame', (username) => {
        try {
            if (CONFIG.DEBUG) console.log(`Creating New Game - Username: ${username}\n`)
            if (username == null) return socket.emit('newgame', { err: "Username Required" })
            // Generate New ID, Create New Game, Add Game To Memory
            const newid = randomUUID()
            const game = new Game(newid)
            // Create New Player, Return On Error
            if (CONFIG.DEBUG) console.log(`Started New Game, Socket ID: ${socket.id}`) 
            const player = game.addPlayer(username, socket.id)
            if (player.err !== undefined) return socket.emit('newgame', player.err);
            // Add Game To Memory
            GAMES[newid] = game;
            // Join Socket Room, Send Game And Player
            socket.join(newid);
            return socket.emit('newgame', { player_id: player.id, game: game })
        } catch(err) {
            if (CONFIG.DEBUG) console.log(`Error: New Game: ${err}\n`)
        }
    })

    socket.on('joingame', (gameid, username) => {
        try {
            if (CONFIG.DEBUG) console.log(`Joining Game:\nId: ${gameid}\nUsername: ${username}\n`)
            if (gameid == null) return socket.emit('newgame', { err: "Game Id Required" })
            if (username == null) return socket.emit('newgame', { err: "Username Required" })
            // Get Game, Check That It Exists
            const game = GAMES[gameid]
            if (game === undefined) {
                return socket.emit('joingame', { err: `Game Doesn't Exist` });
            }
            // Try To Create New Player
            if (CONFIG.DEBUG) console.log(`Joined Game, Socket ID: ${socket.id}`) 
            const player = GAMES[gameid].addPlayer(username, socket.id);
            if (player.err !== undefined) return socket.emit('joingame', { err: player.err });
            socket.join(gameid);
            // Send Just To Players In That Room
            io.to(gameid).emit('playerjoined', { players: game.players })
            return socket.emit('joingame', { player_id: player.id, game: game })
        } catch(err) {
            if (CONFIG.DEBUG) console.log(`Error: Join Game: ${err}\n`)
        }

    })

    socket.on('leavegame', (gameid, playerid) => {
        try {
            if (CONFIG.DEBUG) console.log(`Leaving Game\nGameId: ${gameid}\nPlayerId: ${playerid}\n`)
            // Get Game, Check That It Exists
            const game = GAMES[gameid]
            if (game === undefined) {
                return socket.emit('joingame', { err: `Game Doesn't Exist` });
            }
            if (CONFIG.DEBUG) console.log(`Left Game, Socket ID: ${socket.id}`) 
            const result = GAMES[gameid].removePlayer(playerid);
            if (result.err !== undefined) {
                return socket.emit('leavegame', result.err);
            }
            if (CONFIG.DEBUG) {
                socket.rooms.forEach( room => {
                    console.log(`RoomId: ${room}`)
                })
            }
            socket.leave(gameid);
            io.to(gameid).emit('player_left', { players: game.players, player_id: playerid });
            return socket.emit('leavegame', 0);
        } catch(err) {
            if (CONFIG.DEBUG) console.log(`Error: Leaving Game: ${err}\n`)
        }
    })

    socket.on('message', (gameid, playerid, message) => {
        try {
            if (CONFIG.DEBUG) console.log(`PlayerId: ${playerid}`)
            if (CONFIG.DEBUG) console.log(`Message Event: ${message}\n`)
            return io.to(gameid).emit('message', { playerid: playerid, message: message })
        } catch(err) {
            if (CONFIG.DEBUG) console.log(`Error: Message: ${err}\n`)
        }
    })

    socket.on('startgame', (gameid) => {
        try {
            if (CONFIG.DEBUG) console.log(`Starting Game: ${gameid}\n`);
            // Get Game, Check That It Exists
            const game = GAMES[gameid]
            if (game === undefined) {
                return socket.emit('startgame', { err: `Game Doesn't Exist` });
            }
            if (game.game_state != GAMESTATE.FILLING_LOBBY) {
                return socket.emit('startgame', { err: "Game Cannot Be Started Right Now" })
            }
            GAMES[gameid].game_state = GAMESTATE.STARTING_GAME
            // Emit Start Game Signal
            io.to(gameid).emit('startgame', { game_state: GAMESTATE.STARTING_GAME })
            // Start Game Server - Passing io 
            GAMES[gameid].Run(io)
        } catch(err) {
            if (CONFIG.DEBUG) console.log(`Error: Starting Game: ${err}\n`)
        }
    })

    /* 
        API To Send Players Events (Maps To Game Id)
            Gameid,
            Payload = {
                PlayerId: Player
                Type: Event Type
                Data: {
                    ...
                }
            }
    */
    socket.on('player_event', (gameid, payload) => {
        try {
            GAMES[gameid].playerEvent(payload)
        } catch (err) {
            if (CONFIG.DEBUG) console.log(`Game Event Error: ${err}\n`)
        }
    })

})


// Default Working
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Backend Is Working</h1>`)
})

app.get('/games', (req, res) => {
    const games = []
    let keys = Object.keys(GAMES)
    keys.forEach(key => {
        const game = GAMES[key]
        if (game.game_state === GAMESTATE.FILLING_LOBBY) {
            const tmp = {id: key, players: game.players.length, host: game.players[0].username}
            games.push(tmp)
        }
    })
    return res.status(200).json({games: games})
})


server.listen(CONFIG.PORT, () => {
    console.log(`Listening at http://localhost:${CONFIG.PORT}`)
    // Remove Games With No Players Periodically (minutes * seconds * miliseconds)
    setInterval(() => RemoveDeadGames(), 1 * 60 * 1000)
})