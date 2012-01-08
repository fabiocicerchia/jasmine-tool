var server = require(__dirname+'/testserver')
  reporters = require(__dirname+'/reporters'), 
  app = require(__dirname+'/ServerRoutes'),
  runner = require(__dirname+'/TestRunner'),
  emitter = new(require('events').EventEmitter),
  defaultConfig = {server:{port:8124}};

function newServer(config){
  config = (!config)? defaultConfig : config;
  app.configure(config);

  var providedIo = (config && config.provided_io) ? config.provided_io : undefined;

  server.init(emitter); // this stinks to high heaven
  var testServer = new server.TestServer(app.routes, config),
    testRunner = new runner.RemoteTestRunner(emitter);
  
  testRunner.addReporter(new reporters.ConsoleReporter(config));
  testRunner.addReporter(new reporters.NotifierReporter());

  testServer.on('server-started', function(){
    testRunner.start(app.routes, providedIo);
  });
  return testServer;
}  
 
exports.newServer = newServer;

