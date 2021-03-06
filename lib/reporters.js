(function(ctx){
  var colors = require('colors'),
      NotifierReporter = require(__dirname+'/notify').NotifierReporter,
  log = console.log;

  var ConsoleReporter = function(config) {
    this.mutePassed = (config && config.console_reporter && config.console_reporter.mute_passed)? true : false;

    };

  ConsoleReporter.prototype = {
    reportRunnerStarting : function(){
      log("Running specs...");
    },

    reportSuiteResults : function(suite){
      var results = suite.results;
      var passed = (results.failedCount === 0);
      if(passed && this.mutePassed)
        return;
      else {
      var color = !passed ?'red':'green';
      log((suite.padding+suite.desc)[color]);
      log((suite.padding+'  Passed: ' + results.passedCount + ' Failed: ' + results.failedCount + ' Total: ' + results.totalCount)[color]);
      }
    },

    reportSpecResults : function(spec){
      var results = spec.results;
      var desc = spec.padding+results.description;
      var passed = (results.failedCount === 0);
      if(passed && this.mutePassed)
        return;
      else {
      var color = !passed ?'red':'green';
      log(desc[color]);
      log((spec.padding+'  Passed: ' + results.passedCount + ' Failed: ' + results.failedCount + ' Total: ' + results.totalCount)[color]);
      }
    },

    reportRunnerResults : function(results){
      var passed = (results.failedCount === 0);
      var color = !passed ?'red':'green';
      log(('Specs finished : Passed: ' + results.passedCount + ' Failed: ' + results.failedCount + ' Total: ' + results.totalCount)[color]);

    }


  };

  ctx.ConsoleReporter = ConsoleReporter;
  ctx.NotifierReporter = NotifierReporter;
})(exports);
