'use strict';

////////////////////////////////////////////////////////////
////////////////////  State Machine    ////////////////////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Stately =       require('stately.js');
const uuidv1 =        require('uuid/v1');

function reporter(event, oldState, newState) {

    var transition = oldState + ' => ' + newState;

    switch (transition) {
        /*
        ...
        case 'STOPPED => PLAYING':
        case 'PLAYING => PAUSED':
        ...
        */
        default:
            console.log(transition);
            break;
    }
}

var initialStateName = "STOPPED"

var statesObject = {

    'STOPPED': {
        onEnter: reporter,
        next: function () {
            return this.PLAYING;
        }
    },
    'PLAYING': {
        onEnter: reporter,
        stop: function () {
            return this.STOPPED;
        },
        next: function () {
            return this.PAUSED;
        }
    },
    'PAUSED': {
        onEnter: reporter,
        next: function () {
            return this.PLAYING;
        },
        stop: function () {
            return this.STOPPED;
        }
    }
};

var machine = new Stately(statesObject, initialStateName);
let cnt = 0

module.exports = function(router) {
    router.use(bodyParser.json());
      router.use(function(req, res, next) {

      console.log("-------------------- " + cnt)
      machine.next()
      cnt++

    })
  }
