var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});


var restify = require('restify');
var builder = require('botbuilder');

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

var inMemoryStorage = new builder.MemoryBotStorage();

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome .");
        builder.Prompts.text(session, "Please select a crop that you want to sell");
    },
    function (session, results) {
        session.dialogData.crop = builder.EntityRecognizer.findEntity([results.response]);
        builder.Prompts.time(session, "when do you want to sell");
    },
    function (session, results) {
        session.dialogData.sellingTime =builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "the price for the "+session.dialogData.crop+" during "+session.dialogData.sellingTime+" is Rs 5000/-");
        session.endDialog();
    },function(session){
        var msg = new builder.Message(session)
    .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
               body: [
                    {
                        "type": "TextBlock",
                        "text": "Adaptive Card design session",
                        "size": "large",
                        "weight": "bolder"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Conf Room 112/3377 (10)"
                    },
                    {
                        "type": "TextBlock",
                        "text": "12:30 PM - 1:30 PM"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Snooze for"
                    },
                    {
                        "type": "Input.ChoiceSet",
                        "id": "snooze",
                        "style":"compact",
                        "choices": [
                            {
                                "title": "5 minutes",
                                "value": "5",
                                "isSelected": true
                            },
                            {
                                "title": "15 minutes",
                                "value": "15"
                            },
                            {
                                "title": "30 minutes",
                                "value": "30"
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Snooze"
                    },
                    {
                        "type": "Action.OpenUrl",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "I'll be late"
                    },
                    {
                        "type": "Action.OpenUrl",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Dismiss"
                    }
                ]
        }
    });

    }
    
]).set('storage', inMemoryStorage); // Register in-memory storage 

// Create your bot with a function to receive messages from the user
// Create bot and default message handler
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi.... Please type crops to view the options available ");
});

// Add dialog to return list of shirts available
bot.dialog('crops', [function (session,results) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("WHEAT")
           // .subtitle("100% Soft and Luxurious Cotton")
            //.text("click on ")
            .images([builder.CardImage.create(session, 'D:/bot1/bot1/wheat.jpg')])
            .buttons([
                builder.CardAction.imBack(session, "please enter the month and year to sell the produce", "Click Here")
            ]),
        new builder.HeroCard(session)
           .title("RICE")
           // .subtitle("100% Soft and Luxurious Cotton")
           // .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session,"D:/bot1/bot1/rice.jpg")])
            .buttons([
                builder.CardAction.imBack(session, "please enter the month and year to sell the produce", "Click Here")
            
            ])

    ]); 
 // session.dialogData.sellingTime = builder.EntityRecognizer.resolveTime([results.response]);
       session.send(msg).endDialog();
}).triggerAction({ matches: /^(crops|crop)/i }),
function (session, results) {
    session.dialogData.crop = builder.EntityRecognizer.findEntity([results.response]);
    builder.Prompts.time(session, "when do you want to sell");
}
   
//session.endDialog();
