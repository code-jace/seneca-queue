
var async = require('async')

function memory(role, seneca, options) {
  var queue = async.queue(worker, options.concurrency)

  seneca.add({
    role: role,
    hook: 'start'
  }, function(args, done) {
    queue.resume()
    done()
  })

  seneca.add({
    role: role,
    hook: 'stop'
  }, function(args, done) {
    queue.pause()
    done()
  })

  seneca.add({
    role: role,
    hook: 'enqueue'
  }, function(args, done) {
    if (!args.task) {
      return done(new Error('no task specified'))
    }
    queue.push(args.task)
    done()
  })

  function worker(task, cb) {
    seneca.act(task, cb)
  }
}

module.exports = memory