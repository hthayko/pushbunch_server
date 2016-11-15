var express = require('express');
var router = express.Router();

var onesignal = require('node-opensignal-api');
var onesignal_client = onesignal.createClient();
 

var texts = [
	"Hello!! :-D", 
	"🧀",
	"🦄🦄",
	"I love cheese, 🧀",
	"I love you <3 :*",
	"You are gooooooood Will.i.am",
	"Jessica",
	"Gwenyth"
	];

var notificationsCount = 200;
var notificaitonId = null;

router.post('/register_key', function(req, res, next) {
	console.log("aaaaa");

	notificaitonId = req.body.user_id;
	console.log("registered device with key " + notificaitonId);
	res.status(200)
	.json({
	  status: 'success',
	  message: 'Device registered'
	});
});

router.get('/device', function(req, res, next) {
	res.status(200)
	.json({
	  status: 'success',
	  message: notificaitonId
	});
});

/* GET home page. */
router.get('/explode_pushes', function(req, res, next) {
	
	if (notificaitonId === null || notificaitonId === undefined) {
		return next("please register a device first (open app and wait until it says done and kill the app)");
	}
	var count = parseInt(req.query.count);
	if (isNaN(count)) {
		count = 200;
	}

	for (var i = 0; i < count ; ++i) {
		var text = texts[i % texts.length];
        setTimeout(function() {
        	var index = Math.floor(Math.random() * texts.length);
        	var text = texts[index];
        	sendPush(notificaitonId, text);
        }, i * 10);
    }
    
	res.status(200)
	.json({
	  status: 'success',
	  message: 'Proccess started'
	});
});


function sendPush(user_id, content) {
    var restApiKey = 'NGJiNDQzOTYtODBlMi00YzdjLTllM2UtMjMwYjgwOGRlZjRm';
    var params = {
        app_id: '65463ccb-e1ce-42b2-9154-b0a074a46542',
        contents: {
            'en': content
        },
        include_player_ids: [user_id],
        isIos: true
    };
        onesignal_client.notifications.create(restApiKey, params, function (err, response) {
            if (err) {
                console.log('Encountered error', err);
            } else {
                console.log(response);
            }
        });    
}


module.exports = router;
