
var APP_ID = undefined;
var request = require('request');

var APP_STATES = {
    INPUT_OBJECT: "_INPUT_OBJECT_MODE", // Waiting for the user the input an object he wants to print.
    SELECT_INPUT: "_SELE_OBJECT_MODE", //Waiting for the user to input a number and thereby selecting one of the presented objects
};

var Alexa = require("alexa-sdk");
var currentObject='';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(newSessionHandlers, inputObjectModeHandlers, selectInputModeHandlers);
    console.log("registered Handles");
    alexa.execute();
};

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = APP_STATES.INPUT_OBJECT;
        this.emit(':ask','What do you want to print on the 3D printer?','What do you want to print on the 3D printer?');
    },
    'Unhandled': function() {
        this.emit(':ask', 'What do you want to print on the 3D printer?', 'What do you want to print on the 3D printer?');
    }
};

var inputObjectModeHandlers = Alexa.CreateStateHandler(APP_STATES.INPUT_OBJECT, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },

    'NewObjectIntent': function () {
      //the first request to thingiverse should be here

      //The data should be be inserted in the message below
      //Try to acces the slot of the alexa voice command and print it out on the command line

      var firstName = '';
      var secondName = '';
      var thirdName = '';

      switch(this.event.request.intent.slots.Object.value){
        case 'fork':
          firstName = 'Big Fork';
          secondName = 'Light Fork';
          thirdName = 'French Fries Fork';
          currentObject='fork';
          break;
        case 'gear':
          firstName = 'Small gear wheel';
          secondName = 'Medium gear wheel';
          thirdName = 'Big gear wheel';
          currentObject='gear';
          break;
        case 'logo':
          currentObject = 'logo';
      }
      if(this.event.request.intent.slots.Object.value==='logo'){
        var message ='Ok I found the logo of the Factory Hack 2017. Do you want to print it in size number one, size number two, or size number three?';
      }else{
        var message ='Ok I found a few models on Thing E Verse.com: Number one is called: '+firstName+', number two is called '+secondName+' and number three is called '+thirdName+'. Do want to print number one, two, or three?';
      }
      this.handler.state = APP_STATES.SELECT_INPUT;
      this.emit(':ask',message,message)
    },

    'AMAZON.HelpIntent': function() {
        this.emit(':ask', 'I can print some object you want. Try sayin print an object.', 'Try sayin: print an object.');
    },

    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying print object again.', 'Try saying print object again.');
    }

});

var selectInputModeHandlers = Alexa.CreateStateHandler(APP_STATES.SELECT_INPUT, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },

    'SelectObjectIntent': function () {
      //a request is made to the blockchain server

      var blockchainURL = 'http://ec2-34-251-89-33.eu-west-1.compute.amazonaws.com:4000/';

      //switch statement: fork1 > french fries fork, fork > big fork, fork2 > light fork
      var thingiverseID = '112371';
      if(currentObject==='logo'){
        thingiverseID = '0';
      } else{
      switch(this.event.request.intent.slots.number.value){
        case 1:
          if(currentObject=='gear'){
            thingiverseID = 'gearw';
          }else{
            thingiverseID = 'fork';
          }
          break;
        case 2:
            if(currentObject=='gear'){
              thingiverseID = 'gearw1';
            }else{
              thingiverseID = 'fork1';
            }
            break;
        case 3:
            if(currentObject=='gear'){
              thingiverseID = 'gearw2';
            }else{
              thingiverseID = 'fork2';
            }
              break;
        default:
            thingiverseID = '0';
      }
    }


      function requestCallback(err, res){
          if (err) return console.error(err.message);
          console.log(res.body);
          var priceEtherium = 0.1;
          var message = 'Sending the data to the printer. This printing costs you '+priceEtherium+' ether. That is approximatly '+(priceEtherium*18)+' Euros';
          this.emit(':tell', message, message);
      };
      blockchainURL = blockchainURL + thingiverseID;
      request(blockchainURL, requestCallback.bind(this));
    },

    'AMAZON.HelpIntent': function() {
        this.emit(':ask', 'I can print some object you want. Try sayin print an object.', 'Try sayin print an object.');
    },
    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that. Try saying the number again.', 'Try saying the number again.');
    }

});
