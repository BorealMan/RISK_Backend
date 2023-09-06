import CONFIG from './config.js'
import express from './node_modules/express/index.js'
import cors from './node_modules/cors/lib/index.js'

// Init Express API
const app = express()
const icors = cors()
app.use(icors)

// Game Dict
const Games = {};

app.get('/newgame', (req, res) => {
    // Create a new game and return the key
})

app.get('/', (req, res) => {
    const msg = `<h1>Hello World</h1>`;

    res.status(200)
    res.send(msg)
})


app.listen(CONFIG.PORT, () => {
    console.log(`Listening at http://localhost:${CONFIG.PORT}`)
})