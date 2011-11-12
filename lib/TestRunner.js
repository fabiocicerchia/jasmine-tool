  var io = require('socket.io'),
    events = require('events');

  function RemoteTestRunner(emitter){
    this.emitter = emitter || new events.EventEmitter();
  }
  RemoteTestRunner.prototype.addReporter = function(reporter){
    var emitter =this.emitter;
    emitter.on('start', reporter.reportRunnerStarting);
    emitter.on('suite', reporter.reportSuiteResults);
    emitter.on('spec', reporter.reportSpecResults);
    emitter.on('finished', reporter.reportRunnerResults);
  };
  RemoteTestRunner.prototype.start =function(app, providedIo) {
    var emitter = this.emitter;
    var socket = (providedIo || io).listen(app);
    socket.set('log level', 1);
    
    var remotesock = socket.of('/jasmine-remote');
  
    remotesock.on('connection', function(client){
      
      client.on('report', function(msg){
        emitter.emit(msg.type, msg);
      });
      
      emitter.on('reload', function(){
        client.emit('reload');
      });
    });
  };

  exports.RemoteTestRunner = RemoteTestRunner;
    
