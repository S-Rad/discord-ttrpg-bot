const Discord = require('discord.js');
const config = require("./config.json");
const client = new Discord.Client();
let games = {table:[]}
const fs = require('fs');


client.once('ready', () => {
    loadJSON();
	console.log('Ready!');
});

client.on('message', message => {
    let text;

    if(message.content.charAt(0) == config.prefix){
        text = message.content.slice(1, message.content.length);

        if (text.toLocaleLowerCase == 'ping') {
            // send back "Pong." to the channel the message was sent in
          
            message.channel.send('Pong.');
        }
        if(text.startsWith('add')){
            addGame(text);
        }

        if(text.startsWith('reset')){
            resetGames();
            updateJSON();
        }

    }
});

const loadJSON = () => {
     fs.readFile('games.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log("Error in loading: " + err);
        } else {
            console.log("Parsing data: "+ data);
        games = JSON.parse(data); //now it an object
    }});

}

const updateJSON = () => {
    let json;

    json = JSON.stringify(games); //convert it back to json
    fs.writeFile('games.json', json, 'utf8',(err) => {
        if (err) console.log("Error in update: " + err);
      });

}

const addGame = (text) => {
    let game = {
        "text": text
    }

    fs.readFile('games.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        games = JSON.parse(data); //now it an object
        games.table.push(game); //add some data
        updateJSON();
    }});
}

const resetGames = () => {
    games = {table:[]}
    console.log("Table content: " + games.table);
}


const deleteGame = (id) => {
  
}

client.login(config.token);

