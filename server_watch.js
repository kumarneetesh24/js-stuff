var cluster = require('cluster');
var numWorkers = require('os').cpus().length;

restartWorkers = function restartWorkers(){

}

if(cluster.isMaster){
  var i, worker;
  var fs = require('fs');
  console.log("Server is setting up" + numWorkers + 'workers');

  for (var i = 0; i < numWorkers; i++) {
    worker = cluster.fork();
    worker.on('message', function(){
      console.log("arguments",arguments);
    });
  }

  fs.readdir('.',function(err,files){
      files.each(function(file){
        fs.watch(file,function(){
          restartWorkers();
        });
      });
  });

  cluster.on('exit',function(worker,code,signal){
    console.log("Worker "+ worker.process.pid+ " died with code "+ code+ " and signal "+ signal);
    console.log("new worker is starting");
    worker = cluster.fork();
    worker.on('message',function(){
      console.log('arguments',arguments);
    });
  });
}
