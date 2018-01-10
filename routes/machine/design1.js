'use strict';

////////////////////////////////////////////////////////////
////////////////////  State Machine    ////////////////////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Stately =       require('stately.js');
const uuidv1 =        require('uuid/v1');
const clone =         require('clone-deep')
const { initialize,
        intent,
        assessconfidence,
        composeresponse,
        response,
        record } =        require('../stages')

function chronologer(event, oldState, newState) {

    var transition = oldState + ' => ' + newState;

    switch (newState) {
        /*
        ...
        case 'STOPPED => PLAYING':
        case 'PLAYING => PAUSED':
        ...
        */
        case 'PAUSED':
          console.log("-------------")
          console.log("fired off transaction")
        default:
            console.log(transition);
            break;
    }
}



var initialStateName = "START"

var statesObject = {

    'START': {
        onEnter: chronologer,
        next: function (req, res, msg) {
            notifymembers(req, res, msg, function(){
                console.log("returned >>>>>>>>>>>>>")
            })
            return this.SAVING;

        }
    },
    'SAVING': {
        onEnter: chronologer,
        stop: function () {
            return this.STOPPED;
        },
        next: function (req, res, msg) {
            saveobject(req, res, msg)
            return this.GETTING;
        }
    },
    'GETTING': {
        onEnter: chronologer,
        play: function () {
            return this.PLAYING;
        },
        next: function (req, res, msg) {
            getobject(req, res, msg)
            return this.START;
        }
    }
};

var Example = require("../../exampleModel.js");

let cnt = 1000
let objMsg = {
  name: "ChaoticBot",
  number: cnt,
  email: "chaotic@gmail.com",
  boolean: true,
  array: [],
  date: undefined,
  message: "This is a testing process",
  state: ""
}
let machine = new Stately(statesObject, initialStateName);

module.exports = function(router) {
    router.use(bodyParser.json());
      router.use(function(req, res, next) {
          console.log("-------------------- " + cnt)
          let msg = {message: "Hello Wonderful Components"}
          machine.next(req, res, msg)
      })
    }
