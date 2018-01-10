'use strict';

////////////////////////////////////////////////////////////
////////////////////  State Machine    ////////////////////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Stately =       require('stately.js');
const uuidv1 =        require('uuid/v1');
const clone =         require('clone-deep')
const plugins =        require('../../components')
const dialogues =      require('../../dialogues')

var initialStateName = "START"

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
//let machine = new Stately(statesObject, initialStateName);

module.exports = function(router) {
    router.use(bodyParser.json());
      router.use(function(req, res, next) {
          console.log("-------------------- " + cnt)
          let msg = {message: "Hello Wonderful Components"}
          console.log("----------plugins-------------")
          console.log(plugins)
          console.log("----------dialogues-------------")
          console.log(dialogues)
          //machine.next(req, res, msg)
      })
    }
