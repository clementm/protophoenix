# phoenixproto

Adds [phoenix protocol](#http://github.com/m1ch3lcl/phoenixd) support to a net.Socket instance.

```javascript
var net = require('net');
var protophoenix = require('protophoenix');

var server = net.connect({host: 127.0.0.1, port:5978}, function() {
  protophoenix(server);
  server.on('inf', function(params){
    console.log(params.name + ' : ' + params.description);
  });
  server.sendCommand('hsig', {
    username: "me",
    password: "pass"
  });
});
```
