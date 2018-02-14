var restify = require('restify');
var builder = require('botbuilder');
//var adaptivecards= require('adaptivecards');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});


var c;
//var builder = require('botbuilder');

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
server.post('/api/messages', connector.listen());


var price ="5000";


// Create your bot with a function to receive messages from the user
// Create bot and default message handler
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... please type crops to view the options available");
});

// Add dialog to return list of shirts available
bot.dialog('crops', function (session,results) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("WHEAT")
           // .subtitle("100% Soft and Luxurious Cotton")
            //.text("click on ")
            .images([builder.CardImage.create(session, 'D:/bot1/bot1/wheat.jpg')])
            .buttons([
                
                builder.CardAction.postBack(session, "cropvalue wheat", "Click Here")
            ]),
        new builder.HeroCard(session)
           .title("RICE")
           // .subtitle("100% Soft and Luxurious Cotton")
           // .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session,"D:/bot1/bot1/rice.jpg")])
            .buttons([
                
                builder.CardAction.postBack(session, "cropvalue rice", "Click Here")
            ])
    ]);
    session.send(msg).endDialog();
    
c=builder.CardAction.value

    
}).triggerAction({ matches: /^(crops|crop)/i });



// Add dialog to handle 'Buy' button click
bot.dialog('buyButtonClick', [
    function (session) {
       // var cropName = args.intent.matched[0];
        //console.log(JSON.stringify(args.intent));
         builder.Prompts.time(session, "What time of the year would you like to sell the produce?")       
    },
    
    function (session, results) {
        session.dialogData.sellingTime =builder.EntityRecognizer.resolveTime([results.response]);
        session.send(c+" price for "+session.dialogData.sellingTime+" is "+price).endDialog();
    }  
]).triggerAction({ matches: /^(cropvalue|cropvalues)/i });

