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

    socket.on('disconnect', () => {
        if (CONFIG.DEBUG) console.log(`A User Disconnected\n`)
    })

    socket.on('newgame', (username) => {
        if (CONFIG.DEBUG) console.log(`Creating New Game - Username: ${username}\n`)
        if (username == null) return socket.emit('newgame', { err: "Username Required" })
        // Generate New ID, Create New Game, Add Game To Memory
        const newid = randomUUID()
        const game = new Game(newid)
        // Create New Player, Return On Error
        const player = game.addPlayer(username)
        if (player.err !== undefined) return socket.emit('newgame', player.err);
        // Add Game To Memory
        GAMES[newid] = game;
        // Join Socket Room, Send Game And Player
        socket.join(newid);
        return socket.emit('newgame', { player_id: player.id, game: game })
    })

    socket.on('joingame', (gameid, username) => {
        if (CONFIG.DEBUG) console.log(`Joining Game:\nId: ${gameid}\nUsername: ${username}\n`)
        if (gameid == null) return socket.emit('newgame', { err: "Game Id Required" })
        if (username == null) return socket.emit('newgame', { err: "Username Required" })
        // Get Game, Check That It Exists
        const game = GAMES[gameid]
        if (game === undefined) {
            return socket.emit('joingame', { err: `Game Doesn't Exist` });
        }
        // Try To Create New Player
        const player = GAMES[gameid].addPlayer(username);
        if (player.err !== undefined) return socket.emit('joingame', { err: player.err });
        socket.join(gameid);
        // Send Just To Players In That Room
        io.to(gameid).emit('playerjoined', { players: game.players })
        return socket.emit('joingame', { player_id: player.id, game: game })
    })

    socket.on('leavegame', (gameid, playerid) => {
        if (CONFIG.DEBUG) console.log(`Leaving Game\nGameId: ${gameid}\nPlayerId: ${playerid}\n`)
        // Get Game, Check That It Exists
        const game = GAMES[gameid]
        if (game === undefined) {
            return socket.emit('joingame', { err: `Game Doesn't Exist` });
        }
        const result = GAMES[gameid].removePlayer(playerid);
        if (result.err !== undefined) {
            return socket.emit('leavegame', result.err);
        }
        socket.leave(gameid);
        io.to(gameid).emit('player_left', { players: game.players });
        return socket.emit('leavegame', { game: game, player_id: playerid })
    })

    socket.on('message', (gameid, playerid, message) => {
        if (CONFIG.DEBUG) console.log(`PlayerId: ${playerid}`)
        if (CONFIG.DEBUG) console.log(`Message Event: ${message}\n`)
        return io.to(gameid).emit('message', { playerid: playerid, message: message })
    })

    socket.on('startgame', (gameid) => {
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
        return io.to(gameid).emit('startgame', { game_state: GAMESTATE.STARTING_GAME })
    })

})


// Default Working
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Backend Is Working</h1>`)
})


server.listen(CONFIG.PORT, () => {
    console.log(`Listening at http://localhost:${CONFIG.PORT}`)
    // Remove Games With No Players Periodically (minutes * seconds * miliseconds)
    setInterval(() => RemoveDeadGames(), 1 * 60 * 1000)
})