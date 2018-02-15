

var restify = require('restify');

var builder = require('botbuilder');
 var functions =require('./functions.js');
 

// Setup Restify Server

var server = restify.createServer();

server.listen(3978, function () {

    console.log('%s listening to %s', server.name, server.url);

});

 

// Create chat connector for communicating with the Bot Framework Service

var connector = new builder.ChatConnector({

    appId: process.env.MicrosoftAppId,

    appPassword: process.env.MicrosoftAppPassword

});

 

// Listen for messages from users

server.post('/api/messages', connector.listen());



 

//server.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?format=json&api-key=579b464db66ec23bdd00000182645d06de5e416a5772c57af1e3ae49 ',function())

 
var bot = new builder.UniversalBot(connector, function (session) {

    session.send("Hi... 'please type 'View crops' to see the options available.");

});

 
var data = functions.mainData('agridata.txt');
// opening sentence

bot.on('conversationUpdate', function (message) {

    if (message.membersAdded) {

        message.membersAdded.forEach(function (identity) {

            if (identity.id === message.address.bot.id) {

                var reply = new builder.Message()

                    .address(message.address)

                    .text('Hello  This is AgroBot a smart advisor !! ');

                bot.send(reply);

            }

        });

    }

});


var cropname;

// Add dialog

bot.dialog('crops', function (session,results) {

    var msg = new builder.Message(session);

    msg.attachmentLayout(builder.AttachmentLayout.carousel)

    msg.attachments([

        new builder.HeroCard(session)
            
            .title("Wheat")
            .images([builder.CardImage.create(session,'D:/bot1/bot1/wheat.jpg')])

           

            .buttons([
                
                builder.CardAction.imBack(session, "wheat", "Show Market Price")
               
            ]),

        new builder.HeroCard(session)

            .title("Rice")

            .images([builder.CardImage.create(session, 'D:/bot1/bot1/rice.jpg')])

            .buttons([

                builder.CardAction.postBack(session, "rice", "Show Market Price")

            ]),

            session.dialogData.var = results.response

    ]);

   

    session.send(msg).endDialog();

    

}).triggerAction({ matches: /^(view|show)/i });

 var c =[1,2,3,4];

bot.dialog('buttonclick', [

    function (session) {
        session.dialogData.cropName ="Rice"
        builder.Prompts.time(session, "At what time of year would you like to sell the produce");

    },

    function (session, results) {

        session.dialogData.sellingTime = builder.EntityRecognizer.resolveTime([results.response]);
        var stateNames= functions.findStates(session.dialogData.cropName, data);
        builder.Prompts.text(session, "Please select a state from the following choices:  \n" + stateNames)
    },
    function (session, results) {
        session.dialogData.selectedState = results.response;
        var price = functions.findMaximumPrice( session.dialogData.cropName, session.dialogData.selectedState, data )
        session.send("Best market price for  "+session.dialogData.cropName+" in " + session.dialogData.selectedState+"  during " + session.dialogData.sellingTime +" is "+price).endDialog();
    }

]).triggerAction({ matches: /^(rice|wheat|maize)/i });

