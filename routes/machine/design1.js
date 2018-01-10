'use strict';

////////////////////////////////////////////////////////////
////////////////////  State Machine    ////////////////////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Stately =       require('stately.js');
const uuidv1 =        require('uuid/v1');
const clone =         require('clone-deep')

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
const notifymembers = (req, res, item, cb) => {
  console.log("MEMBERS NOTIFIED BY TEXT")
  console.log(item)
  res.json(item)
  cb()
}

const saveobject = (req, res, msg) => {
  objMsg.number = cnt
  objMsg.state = machine.getMachineState()
  cnt++
  let content = new Example(objMsg);
  console.log("SAVING OBJECT " + objMsg.number)
  content.save(function(error, doc) {
    if (error) {
      res.send(error);
    }
    else {
      res.send(doc);
    }
  })
}

const getobject = (req, res, msg) => {
  let priorCnt = cnt - 1
  Example.findOne({ 'name': 'ChaoticBot', 'number': priorCnt }, function (err, profile) {
    if (err) return handleError(err);
    if(profile) {
      console.log('%s %s has a state of %s.', profile.name, profile.number, profile.state)
      initialStateName = profile.state
      return
    }
    console.log("--------------------------")
    console.log("MONGO READ FOUND NO USER")
    console.log(profile)
    res.json(profile)
    })
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
