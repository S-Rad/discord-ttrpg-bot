const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()
let games = { table: [] }
const fs = require('fs')
const { loadJSON, resetGames, updateJSON, listGames, showGame, addGame } = require('./games.js')

client.once('ready', () => {
    loadJSON()
    console.log('Ready!')
})

client.on('message', message => {
    let text

    if (message.content.charAt(0) == config.prefix) {
        text = message.content.slice(1, message.content.length)

        if (text.toLocaleLowerCase == 'ping') {
            // send back "Pong." to the channel the message was sent in

            message.channel.send('Pong.')
        }
        if (text.startsWith('add')) {
            if ((text.match(/,/g) || []).length != 4) {
                message.channel.send('Syntax: !add <Name>, <System>, <Startzeit>, <Endzeit>, <Max. Spieleranzahl>')
            } else {
                addGame(text, message.author)
            }
        }

        if (text.startsWith('reset')) {
            resetGames()
            updateJSON()
        }

        if (text.startsWith('list')) {
            message.channel.send(listGames())
        }

        if (text.startsWith('show')) {
            message.channel.send(showGame(message.content.slice(6, message.content.length)))
        }
    }
})

client.login(config.token)
