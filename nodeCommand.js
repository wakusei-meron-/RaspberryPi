
child_process = require('child_process');



module.exports = {

    judgeComand: function(data){
	var command = 'irsend SEND_START lircd.conf ';
	var stopCmd = 'irsend SEND_STOP lircd.conf ';

	switch(data){
	case "power":
	    command += "power";
	    stopCmd += "power"
	    break;
	case "vHigh":
	    command += "volumeUp";
	    stopCmd += "volumeUp";
	    break;
	case "vLow":
	    command += "volumeDown";
	    stopCmd += "volumeDown";	    
	    break;
	case "cUp":
	    command += "channelUp";
	    stopCmd += "channelUp";	    
	    break;
	case "cDown":
	    command += "channelDown";
	    stopCmd += "channelDown";
	    break;
	};

	child_process.exec(command, function(err, stdout, stderr){
	    console.log(stdout);
	});

	setTimeout(function(){
	    child_process.exec(stopCmd, function(err, stdout, stderr){
		console.log(stdout);
	    })
	}, 1000);
    }
};
