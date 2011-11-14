  var io = require('socket.io'),
    events = require('events');

  function RemoteTestRunner(emitter){
    this.emitter = emitter || new events.EventEmitter();
  }
  RemoteTestRunner.prototype.addReporter = function(reporter){
    var emitter =this.emitter;
    emitter.on('start', function(p) {reporter.reportRunnerStarting(p);});
    emitter.on('suite', function(p) {reporter.reportSuiteResults(p);});
    emitter.on('spec', function(p) {reporter.reportSpecResults(p);});
    emitter.on('finished', function(p) {reporter.reportRunnerResults(p);});
  };
  RemoteTestRunner.prototype.start =function(app, providedIo) {
    var emitter = this.emitter;
    var socket = (providedIo || io).listen(app);
    try { 
      socket.set('log level', 1);
    }
    catch(e){
      console.log(e);
    }
    
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
    
