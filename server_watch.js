var cluster = require('cluster');
var numWorkers = require('os').cpus().length;

// function to restart workers
restartWorkers = function restartWorkers(){
  var wid , workersId = [];
  for (wid in cluster.workers) {
    workersId.push(wid);
  }
  // sending signal to worker to shutdown
  workersId.forEach(function(wid){
    cluster.workers[wid].send({
      text : 'shutdown',
      for : cluster.workers[wid].process.pid,
      from : 'master'
    });
// if after 2 seconds wokers are alive forcefully kill i t
    setTimeout(function(){
      // console.log("cheking");
      if(cluster.workers[wid]){
        // console.log("found");
        cluster.workers[wid].kill('SIGKILL');
      }
    },5000)
  })
}

// Master to control woker thread
if(cluster.isMaster){
  var i, worker;
  var fs = require('fs') ;
  console.log('Server is setting up '  + numWorkers + ' workers');

// forking thread s
  for (var i = 0; i < numWorkers; i++) {
    worker = cluster.fork();
    worker.on('message', function(){
      console.log("arguments",arguments);
    });
  }
  // watch the directory for the file change
  // if changes call restartWorkers to restart server
  fs.readdir('.',function(err,files){
      files.forEach(function(file){
        fs.watch(file,function(){
          restartWorkers();
        });
      });
  });

  // restart worker if they fails
  cluster.on('exit',function(deadWorker,code,signal){
    worker = cluster.fork();
    console.log("Worker "+ deadWorker.process.pid+ " died with code "+ code+ " and signal "+ signal);
    // console.log("new worker "+worker.process.pid+ " is starting");

    worker.on('message',function(){
      console.log('arguments',arguments);
    });
  });
}else {
  process.on('message', function(message){
    console.log("safe shutdown received for process "+ message.for);
    if(message.type === 'shutdown'){
      process.exit(0);
    }
  });

  /*code to execute process or task
   * donot use express to make server and routing
   * use custom http server and routing
   * using express for removing the bug
   */
  var express = require('express')();
  express.all("/*",function(req, res){
    res.send("process "+ process.pid+ " says hello").end();
  });
  var server = express.listen(3000, function(){
    console.log('Worker ' + process.pid + ' is listening all request');
  });
}
