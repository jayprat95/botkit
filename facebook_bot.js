/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Facebook bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Facebook's Messenger APIs
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Follow the instructions here to set up your Facebook app and page:

    -> https://developers.facebook.com/docs/messenger-platform/implementation

  Run your bot from the command line:

    page_token=<MY PAGE TOKEN> verify_token=<MY_VERIFY_TOKEN> node facebook_bot.js

  Use localtunnel.me to make your bot available on the web:

    lt --port 3000

# USE THE BOT:

  Find your bot inside Facebook to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.page_token) {
    console.log('Error: Specify page_token in environment');
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log('Error: Specify verify_token in environment');
    process.exit(1);
}


var Botkit = require('./lib/Botkit.js');
var os = require('os');

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'Su6Ds4VAUca5pPnbmkB43A',
  consumer_secret: 'RS3GqlqIDDsaZrgVgejsDRqPxBw',
  token: 'wbUe2EBhjC7vtUWUwKBz1N0UN9qXi6Xc',
  token_secret: 'pdfSHlno-DIpZyLPprdVPlQfyDk',
});




var controller = Botkit.facebookbot({
    debug: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.port || process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    });
});

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

controller.hears(['hello', 'hi', 'yo'], 'message_received', function(bot, message) {


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});



controller.hears(['food'], 'message_received', function(bot, message) {
  bot.startConversation(message, askFlavor);
});


askFlavor = function(response, convo) {
  convo.ask("What are you in the mood for?", function(response, convo) {
    convo.say("Awesome. I like " + response.text + " too!");
    askSize(response, convo, response.text);
    convo.next();
  });
}

askSize = function(response, convo, genre) {
  convo.ask("Where do you want me to search for food?", function(response, convo) {
    convo.say("Ok. I'll try to find" + " " + genre + " at " + response.text); 
    yelp.search({ term: genre, location: response.text})
        .then(function (data) {
              var randNum = randomIntInc(0, data.businesses.length)
              businesses = data.businesses
              convo.say("Here is a place you might like: " + data.businesses[randNum].name + "," + data.businesses[randNum].url); 
              askWhereDeliver(response, convo);
              convo.next();
        })
        .catch(function (err) {
            convo.say('are you sure that is a real place?'); 
    });

  });
}

askWhereDeliver = function(response, convo) { 
        convo.ask('Did you like this place?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Okay cool');
                    convo.stop();
                }
            },
            {
                pattern: bot.utterances.no,
                callback: function(response, convo) {
                    convo.say('Oh bummer :(');
                    convo.next();
                }
            }
      ]);
}



controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received',
    function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');
    });



controller.on('message_received', function(bot, message) {
    bot.reply(message, 'Try: `food`');
    return false;
});


function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
