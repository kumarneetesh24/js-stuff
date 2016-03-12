var cluster = require('cluster');
var numWorkers = require('os').cpus().length;

if (cluster.isMaster) {

  console.log("starting "+numWorkers + " clusters");
  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('online',function (worker) {
    console.log("worker "+ worker.process.pid+ ' is working');
  });
  cluster.on('exit',function(worker,code,signal){
    console.log('worker '+ worker.process.pid + ' stopped with code '+ code + ' and signal '+signal );
    console.log('worker is starting');
    cluster.fork();
  });
}
else {
  var express = require('express')();
  express.all('/*',function(req , res){
    res.end('process ' + process.pid + ' says hello ');
  });

  var server = express.listen(3000 , function () {
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
  });

}
