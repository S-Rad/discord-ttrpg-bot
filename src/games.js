let games = { table: [] }
const fs = require('fs')
const config = require('./config.json')

const loadJSON = () => {
    fs.readFile('games.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log('Error in loading: ' + err)
        } else {
            //console.log("Parsing data: "+ data);
            games = JSON.parse(data) //now it an object
        }
    })
}

const updateJSON = () => {
    let json

    json = JSON.stringify(games) //convert it back to json
    fs.writeFile('games.json', json, 'utf8', err => {
        if (err) console.log('Error in update: ' + err)
    })
}

const addGame = (text, author) => {
    let game = createGameObject(text, author.tag)

    fs.readFile('games.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err)
        } else {
            games = JSON.parse(data) //now it an object
            games.table.push(game) //add some data
            updateJSON()
        }
    })
}

const resetGames = () => {
    games = { table: [] }
    console.log('Table content: ' + games.table)
}

const createGameObject = (args, author) => {
    let text = args.slice(4, args.length)

    let game = {
        id: games.table.length,
        name: '*leer*',
        leiter: author,
        system: '*leer*',
        start: '*leer*',
        end: '*leer*',
        maxplayers: '*leer*',
        players: '*leer*',
        notes: '*leer*',
    }
    game.name = text.slice(0, text.indexOf(','))
    text = text.slice(text.indexOf(',') + 1)
    game.system = text.slice(0, text.indexOf(','))
    text = text.slice(text.indexOf(',') + 1)
    game.start = text.slice(0, text.indexOf(','))
    text = text.slice(text.indexOf(',') + 1)
    game.end = text.slice(0, text.indexOf(','))
    text = text.slice(text.indexOf(',') + 1)
    game.maxplayers = text.slice(0, text.indexOf(','))
    text = text.slice(text.indexOf(',') + 1)

    return game
}

const deleteGame = id => {}

const listGames = channel => {
    let listString = ''
    games.table.forEach(game => {
        listString =
            listString + game.id + ', ' + game.name + ', ' + game.leiter + ', ' + game.system + ', ' + game.start + '\n'
        //message.channel.send(game.name + ", " + game.leiter + ", " + game.system + ", " + game.start);
    })
    channel.send(listString)
}

const showGame = (id, channel) => {
    let game
    if (!isNumeric(id) || id > games.table.length || id < 0) {
        channel.send('Syntax: !show <zahl>. Finde dein Spiel mit !list')
    } else {
        console.log(findGame(id))
    }
}

const findGame = id => {
    let foundgame = {}
    games.table.forEach(game => {
        if (game.id == id) {
            //console.log("Game found: " + game);
            foundgame = game
            if (game == undefined) console.log('undefined game')
        }
    })
    return foundgame
}

function isNumeric(str) {
    if (typeof str != 'string') return false // we only process strings!
    return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
    ) // ...and ensure strings of whitespace fail
}

module.exports = { loadJSON }
