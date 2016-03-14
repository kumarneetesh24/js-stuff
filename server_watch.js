var cluster = require('cluster');
var numWorkers = require('os').cpus().length;

restartWorkers = function restartWorkers(){
  var wid , workersId = [];
  for (wid in cluster.workers) {
    workersId.push(wid);
  }

  workersId.forEach(function(wid){
    cluster.workers[wid].send({
      text : 'shutdown',
      from : 'master'
    });
    setTimeout(function(){
      if(cluster.workers[wid]){
        cluster.workers[wid].kill('SIGKILL');
      }
    },5000);
  })
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
      files.forEach(function(file){
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
}else {
  process.on('message', function(message){
    if(message.type === 'shutdown'){
      process.exit(0);
    }
  });
  console.log('Worker' + process.pid + ' is still alive!');
}
