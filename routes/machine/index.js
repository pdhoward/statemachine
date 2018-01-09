'use strict';

////////////////////////////////////////////////////////////
////////////////////  State Machine    ////////////////////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Stately =       require('stately.js');
const uuidv1 =        require('uuid/v1');
const clone =         require('clone-deep')

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

module.exports = function(router) {
    router.use(bodyParser.json());
      router.use(function(req, res, next) {
      var machine = new Stately(statesObject, initialStateName);
      console.log("-------------------- " + cnt)
      machine.next()
      objMsg.number = cnt
      objMsg.state = machine.getMachineState()
      cnt++
      var content = new Example(objMsg);

      content.findOne({ 'name': 'ChaoticBot', 'number': cnt }, function (err, profile) {
        if (err) return handleError(err);
          console.log('%s %s is a %s.', profile.name, profile.number, profile.state)
        })

      content.save(function(error, doc) {
        if (error) {
          res.send(error);
        }
        else {
          res.send(doc);
        }
      });
    })
  }
