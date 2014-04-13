
child_process = require('child_process');



module.exports = {

    switchOn: function(data){
	var command = 'irsend SEND_START lircd.conf power';
	
	child_process.exec(command, function(err, stdout, stderr){
	    console.log(stdout);
	});
    },

    switchOff: function(data){
	var command = 'irsend SEND_START lircd.conf power';	
	child_process.exec(command, function(err, stdout, stderr){
	    console.log(stdout);
	});	
    }	
};
