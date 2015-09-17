module.exports = function addPhoenixSupport(socket) {
	var available_data = new Buffer(0);
	socket.dataTransfer = false;
  socket.on('data', function(data) {
		socket.pause();
	 	var data = Buffer.concat([available_data, data]);
		var end_ch = String('\n').charCodeAt(0);
		while(data.length > 0) {
			if(socket.dataTransfer) {
				socket.emit('incoming-data', data);
				return;
			}
			var i = 0;
			while(i<data.length && data[i]!=end_ch) {
				i++;
			}
			if(i==data.length) {
				available_data = data;
				socket.resume();
				return;
			}
			cmd_str = data.toString('utf8', 0, i);
			data = data.slice(i+1);
			var cmd_reg = /\$([a-z]{4}) ?(.*)$/i;
      var args_reg = /([a-z_]+):([^|]*)/i;
			if(cmd_reg.exec(cmd_str)) {
				var cmd = RegExp.$1;
				var args = RegExp.$2.split('|');
        var args_obj = {};
        for(var i=0; i<args.length; i++) {
          if(args_reg.exec(args[i])) {
            args_obj[RegExp.$1] = RegExp.$2;
          }
        }
				socket.emit(cmd, args_obj, cmd_str+'\n');
				socket.emit(cmd.slice(0,-3), cmd, args_obj);
			}
		}
		socket.resume();
		available_data = new Buffer(0);
	});

	socket.sendRawCommand = socket.write;

  socket.sendCommand = function(cmd, args_obj) {
    var msg = '$'+cmd;
    if(args_obj) {
      msg += ' ';
      for (var arg in args_obj) {
        msg += arg+':'+args_obj[arg] + '|';
      }
      msg = msg.slice(0,-1);
    }
    socket.write(msg+'\n');
  }
}
