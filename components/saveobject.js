

exports.saveobject = (req, res, msg) => {
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
