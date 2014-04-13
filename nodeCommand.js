
child_process = require('child_process');



module.exports = {

    judgeComand: function(data){
	var command = 'irsend SEND_START lircd.conf ';

	switch(data){
	case "power":
	    command += "power";
	    break;
	case "vHigh":
	    command += "volumeUp";
	    break;
	case "vLow":
	    command += "volumeDown";
	    break;
	case "cUp":
	    command += "channelUp";
	    break;
	case "cDown":
	    command += "channelDown";
	    break;
	};

	child_process.exec(command, function(err, stdout, stderr){
	    console.log(stdout);
	});
    }
    
    switchOn: function(data){
	var command = 'irsend SEND_START lircd.conf power';
	
	child_process.exec(command, function(err, stdout, stderr){
	    console.log(stdout);
	});
    },

    switchOff: function(data){
	var command = 'irsend SEND_STOP lircd.conf power';	
	child_process.exec(command, function(err, stdout, stderr){
	    console.log(stdout);
	});	
    }	
};
