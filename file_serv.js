var http = require('http');
var fs = require('fs');

http.createServer(function(req , res){
    if(req.url === '/favicon.ico'){
      res.end();
    }
    console.log("Incoming request"+ req.url);
    res.writeHead(200,{'Content-Type': 'text/plane'});
    fs.readFile(__filename,{'encoding':'utf8'}, function(error,content){
      if(error){
        console.log(error);
        return res.end();
      }
      console.log("Serving request"+req.url);
      res.end(content);
    });
}).listen(3000);
