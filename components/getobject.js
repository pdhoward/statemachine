
exports.getobject = (req, res, msg) => {
  let priorCnt = cnt - 1
  Example.findOne({ 'name': 'ChaoticBot', 'number': priorCnt }, function (err, profile) {
    if (err) return handleError(err);
    if(profile) {
      console.log('%s %s has a state of %s.', profile.name, profile.number, profile.state)
      initialStateName = profile.state
      res.json(profile)
      return
    }
    console.log("--------------------------")
    console.log("MONGO READ FOUND NO USER")
    console.log(profile)
    res.json(profile)
    })
}
