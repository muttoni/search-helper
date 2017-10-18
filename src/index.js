/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

var config = {};
config.IOT_BROKER_ENDPOINT      = "sdlfsflkjsdlfkjs.iot.eu-west-1.amazonaws.com";  // replace with your own -- also called the REST API endpoint
config.IOT_BROKER_REGION        = "eu-west-1";  // eu-west-1 corresponds to the Ireland Region.  Use us-east-1 for the N. Virginia region
config.IOT_THING_NAME           = "thing1";

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'PictureBrowser',
            HELP_MESSAGE: 'Tell me some thing like: search google for cats, or: show me pictures of cats',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            SEARCH: 'Looking for: ' 
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'PictureBrowser',
            HELP_MESSAGE: 'Tell me some thing like: search google for cats, or: show me pictures of cats',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            SEARCH: 'Looking for: ' 
        },
    },
      
    'de': {
        translation: {
            SKILL_NAME: 'Weltraumwissen auf Deutsch',
            GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
            HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            SEARCH: 'Looking for: ' 
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('Welcome');
    },

    'Welcome' : function() {
        this.emit(':ask','What would you like me to do? You can say something like: show me pictures of cats')
    },

    'ImageSearchIntent': function () {
        var thingSlotRaw = this.event.request.intent.slots.thing.value;
        var newState = { 'searchType' : 'image', 'searchTerm' : thingSlotRaw };
        updateShadow(newState, status => {
            this.emit(':ask', this.t('SEARCH') + thingSlotRaw);
        })
    },

    'TextSearchIntent': function () {
        var thingSlotRaw = this.event.request.intent.slots.thing.value;
        var newState = { 'searchType' : 'text', 'searchTerm' : thingSlotRaw };
        updateShadow(newState, status => {
            this.emit(':ask', this.t('SEARCH') + thingSlotRaw);
        })
    },

    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },

    'Unhandled' : function() {
        this.emit('Welcome');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


function updateShadow(desiredState, callback) {

    AWS.config.region = config.IOT_BROKER_REGION;

    var paramsUpdate = {
        "thingName" : config.IOT_THING_NAME,
        "payload" : JSON.stringify(
            { "state":
                { "desired": desiredState             
                }
            }
        )
    };

    var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});

    iotData.updateThingShadow(paramsUpdate, function(err, data)  {
        if (err){
            console.log(err);
            callback("not ok");
        }
        else {
            console.log("updated thing shadow " + config.IOT_THING_NAME + ' to state ' + paramsUpdate.payload);
            callback("ok");
        }

    });

}
