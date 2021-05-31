const Discord = require('discord.js');
const config = require("./config.json");
const client = new Discord.Client();
let games = {table:[]}
const fs = require('fs');
const regexp = new RegExp(',', 'g');


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
            if((text.match(/,/g) || []).length != 4)
            {
                message.channel.send('Syntax: !add <Name>, <System>, <Startzeit>, <Endzeit>, <Max. Spieleranzahl>');
            }
            else{
                addGame(text, message.author);
            }

        }

        if(text.startsWith('reset')){
            resetGames();
            updateJSON();
        }

        if(text.startsWith('list')){
            listGames(message.channel);
        }

        if(text.startsWith('show')){
            showGame(message.content.slice(6, message.content.length), message.channel);
        }

    }
});

const loadJSON = () => {
     fs.readFile('games.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log("Error in loading: " + err);
        } else {
            //console.log("Parsing data: "+ data);
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

const addGame = (text, author) => {
    let game = createGameObject(text,  author.tag);

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

const createGameObject = (args, author) => {

    let text = args.slice(4, args.length);

    let game =  {
        "id": games.table.length,
        "name": '*leer*',
        "leiter": author,
        "system": '*leer*',
        "start": '*leer*',
        "end": '*leer*',
        "maxplayers": '*leer*',
        "players": '*leer*',
        "notes": '*leer*'
    };
    game.name = text.slice(0, text.indexOf(',')); 
    text = text.slice(text.indexOf(',')+1);
    game.system = text.slice(0, text.indexOf(',')); 
    text = text.slice(text.indexOf(',')+1);
    game.start = text.slice(0, text.indexOf(',')); 
    text = text.slice(text.indexOf(',')+1);
    game.end = text.slice(0, text.indexOf(',')); 
    text = text.slice(text.indexOf(',')+1);
    game.maxplayers = text.slice(0, text.indexOf(',')); 
    text = text.slice(text.indexOf(',')+1);

    return game;


}


const deleteGame = (id) => {
  
}

const listGames = (channel) => {
    let listString = "";
    games.table.forEach(game => {
        listString = listString + game.id + ", " + game.name + ", " + game.leiter + ", " + game.system + ", " + game.start + "\n";
        //message.channel.send(game.name + ", " + game.leiter + ", " + game.system + ", " + game.start);
    });
    channel.send(listString);
}

const showGame = (id, channel) => {
    let game;
    if(!isNumeric(id) || id > games.table.length || id < 0){
        channel.send("Syntax: !show <zahl>. Finde dein Spiel mit !list");
    }
    else{
        console.log(findGame(id));
    }
    
}

const findGame = (id) => {
    let gamename;
    games.table.forEach(game => {
        if(game.id == id){
            gamename = game.name;
            console.log("Game found: " + gamename);
            if(gamename == undefined) console.log("undefined gamename");
            return gamename;
        }
        else{
            return "No game";
        }
    })
} 

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

client.login(config.token);

