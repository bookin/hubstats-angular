var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');


var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/token/:code', function(req, res) {
    //call github api for token
    request.post({
        uri: 'https://github.com/login/oauth/access_token',
        form: {
            client_id:'3ec3571980c809699211',
            client_secret:'fa420a6dca9106c34b98a35d19c0d269cff6d9ae',
            code:           req.params.code
        },
        json: true
    }, function(err, httpResponse, body) {
        //console.log(httpResponse);

        if (err) {
            res.send(500, { error: err });
            return;
        }
        res.send(body);
    });
});

app.get('/github/getRepoTraffic/:token/:owner/:repo', function(req, res) {
    var token = req.params.token;
    var owner = req.params.owner;
    var repo = req.params.repo;
    if(token && owner && repo){
        request.get({
            uri: 'https://api.github.com/repos/'+owner+'/'+repo+'/traffic/views?access_token='+token,
            headers: {
                'Accept': 'application/vnd.github.spiderman-preview',
                'User-Agent': 'Chrome 41.0.2228.0'
            },
            json: true
        }, function(err, httpResponse, body) {
            if (err) {
                res.send(500, { error: err });
                return;
            }
            res.send(body);
        });
    }else{
        res.sendStatus(404);
    }
});

app.get('/github/getRepoReferrers/:token/:owner/:repo', function(req, res) {
    var token = req.params.token;
    var owner = req.params.owner;
    var repo = req.params.repo;
    if(owner && repo){
        request.get({
            uri: 'https://api.github.com/repos/'+owner+'/'+repo+'/traffic/popular/referrers?access_token='+token,
            headers: {
                'Accept': 'application/vnd.github.spiderman-preview',
                'User-Agent': 'Chrome 41.0.2228.0'
            },
            json: true
        }, function(err, httpResponse, body) {
            if (err) {
                res.send(500, { error: err });
                return;
            }
            res.send(body);
        });
    }else{
        res.sendStatus(404);
    }
});


app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
    //res.sendStatus(404);
});

var listener = app.listen(process.env.port || process.env.PORT || 5000, function () {
    console.log('App listening on port %d', listener.address().port);
});