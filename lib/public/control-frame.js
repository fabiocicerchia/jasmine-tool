(function(ctx){
  var jasmine = ctx.jasmine;

  jasmine.WebsocketReporter = function(){
    var self = this;
    this.buffer = [];
    this.connected = false;
    this.remotesock = io.connect('/jasmine-remote');

    this.remotesock.on('reload', function() {
  		window.location.reload();
    });
    
    this.remotesock.on('connect', function(){
      this.connected = true;
      while(self.buffer.length > 0){
        var report = self.buffer.shift();
          self._sendReport(report);
      }
    });
  };
jasmine.WebsocketReporter.prototype = {
  _report : function(report) {
    if(this.remotesock.connected)
      this._sendReport(report);
    else
      this.buffer.push(report);
  },
  
  _sendReport : function(report) {
    this.remotesock.emit('report', report);
  },

  reportRunnerStarting : function(runner) {
    this._report({
      type    : 'start'
    });
  },

  reportSuiteResults : function(suite) {
    this._report({
      type    : 'suite',
      desc    : suite.description,
      results : preventCircular(suite.results()),
      padding : pad(suite.parentSuite)
    });
  },

  reportSpecResults : function(spec) {
    this._report({
      type    :'spec',
      results : preventCircular(spec.results()),
      padding :"  " + pad(spec.suite)
    });
  },

  reportRunnerResults : function(runner) {
    var results = preventCircular(runner.results());
    this._report({
      type        : 'finished',
      failedCount : results.failedCount,
      passedCount : results.passedCount,
      totalCount  : results.totalCount,
      skipped     : results.skipped
    });
  }
};

var pad = function(parent){
   var spaces = '';
    while (parent !== null){
      spaces += '  ';
      parent = parent.parentSuite;
    }
    return spaces;
};

//used to prevent circular references in expected and actual : recursive
var preventCircular = function(results) {
  if(typeof results.actual === 'object' && results.actual !== null) {
    results.actual = results.actual.toString();
  }

  if(typeof results.expected === 'object' && results.expected !== null) {
    results.expected = results.expected.toString();
  }

  if(Array.isArray(results.items_)) {
  var items_ = [];
    results.items_.forEach(function(item) {
      items_.push(preventCircular(item));
    });
  results.items_ = items_;
  }
return results;
};

})(window);
