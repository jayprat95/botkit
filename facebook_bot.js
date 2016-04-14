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


// controller.hears(['food at (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
//     yelp.search({ term: 'food', location: '24060' })
//     .then(function (data) {
//       bot.reply(message, 'Foods: ' + data); 
//     })
//     .catch(function (err) {
//         bot.reply(message, err); 
//     });

// }); 

controller.hears(['food'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.ask('Where do you want me to find food?', function(response, convo) {
            bot.reply(message, 'okay, looking for restaurants...give me a second'); 
            var businesses; 
            var business; 
            if(response.text === 'next') {

                    var randNum = randomIntInc(0, data.businesses.length)
                    businesses = data.businesses; 
                    business = data.businesses[randNum]; 
                    bot.reply(message, {
                          attachment: {
                              'type': 'template',
                              'payload': {
                                  'template_type': 'generic',
                                  'elements': [
                                      {
                                          'title': data.businesses[randNum].name,
                                          'image_url': data.businesses[randNum].image_url,
                                          'subtitle': data.businesses[randNum].location.address[0],
                                          'buttons': [
                                              {
                                                  'type': 'web_url',
                                                  'url': data.businesses[randNum].url,
                                                  'title': 'View restaurant'
                                              }
                                          ]
                                      }
                                  ]
                            }
                        }
                    }); 
            }
            else {
                yelp.search({ term: 'food', location: response.text})
                    .then(function (data) {
                    var randNum = randomIntInc(0, data.businesses.length)
                    businesses = data.businesses; 
                    business = data.businesses[randNum]; 
                    bot.reply(message, {
                          attachment: {
                              'type': 'template',
                              'payload': {
                                  'template_type': 'generic',
                                  'elements': [
                                      {
                                          'title': data.businesses[randNum].name,
                                          'image_url': data.businesses[randNum].image_url,
                                          'subtitle': data.businesses[randNum].location.address[0],
                                          'buttons': [
                                              {
                                                  'type': 'web_url',
                                                  'url': data.businesses[randNum].url,
                                                  'title': 'View restaurant'
                                              }
                                          ]
                                      }
                                  ]
                            }
                        }
                    });         
            } 

                // convo.next(); 

                })
                .catch(function (err) {
                    bot.reply(message, 'are you sure that is a real place?'); 
                    // convo.next(); 
            });
        }); 
        convo.next();
    }); 

    

});


controller.hears(['structured'], 'message_received', function(bot, message) {

    bot.reply(message, {
        attachment: {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': [
                    {
                        'title': 'Classic White T-Shirt',
                        'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                        'subtitle': 'Soft white cotton t-shirt is back in style',
                        'buttons': [
                            {
                                'type': 'web_url',
                                'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                                'title': 'View restaurant'
                            }
                        ]
                    }
                ]
            }
        }
    });
});

controller.on('facebook_postback', function(bot, message) {

    bot.reply(message, 'Great Choice!!!! (' + message.payload + ')');

});

controller.hears(['call me (.*)', 'my name is (.*)'], 'message_received', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'message_received', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});

// controller.hears(['shutdown'], 'message_received', function(bot, message) {

//     bot.startConversation(message, function(err, convo) {

//         convo.ask('Are you sure you want me to shutdown?', [
//             {
//                 pattern: bot.utterances.yes,
//                 callback: function(response, convo) {
//                     convo.say('Bye!');
//                     convo.next();
//                     setTimeout(function() {
//                         process.exit();
//                     }, 3000);
//                 }
//             },
//         {
//             pattern: bot.utterances.no,
//             default: true,
//             callback: function(response, convo) {
//                 convo.say('*Phew!*');
//                 convo.next();
//             }
//         }
//         ]);
//     });
// });


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received',
    function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');
    });



controller.on('message_received', function(bot, message) {
    bot.reply(message, 'Try: `food` or `structured` or `call me captain`');
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
