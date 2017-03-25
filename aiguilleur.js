var http = require("http");
var express = require('express');
var querystring = require('querystring');
var app = express();//variable qui gère l'application
var request = require('request');

//liste de serveur à connecter pour la solution à équilibrage de charge.
var listServeurs = [{adresse: "127.0.0.1", port: "8092", nbRequest: 0},
                    {adresse: "127.0.0.1", port: "8093", nbRequest: 0},
                    {adresse: "192.168.43.116", port: "8092", nbRequest: 0}]; 


//liste des requêtes utilisateur à sous-traiter  à la solution NLB (Network Load Balancing)
var list_requestd = []; 



function lessChargedServer() {
    var index = 0;
    for (var i = 0; i < listServeurs.length-1; i++) {
        if (listServeurs[i].nbRequest<listServeurs[i+1].nbRequest) {
            index = i;

        }
        else{
            index = i+1;
        }
    }
    listServeurs[index].nbRequest++;

    return index;
}

function getSocket() {
    var sock = listServeurs[lessChargedServer()];

    return sock;
}
//subscribe
app.get('/subscribe', function (req, res) {
    var login = req.query.login;
    var socket = getSocket();
    console.log("getSocket: "+socket.adresse+" :"+socket.port+" "+socket.nbRequest)
    const options = {  
        url: 'http://localhost:8092/subscribe?login='+login,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function(err, ress, body) {  
        console.log(body);
        if(!err){
            res.send(body);
        }
    });
});

//addSalon
app.post('/addSalon', function (req, res) {
    var nomSalon = req.query.nomSalon;
    var login = req.query.login;
    const options = {  
        url: 'http://localhost:8092/addSalon?login='+login+"&nomSalon="+nomSalon,
        method: 'POST',
        body:login,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function(err, ress, body) {  
      
        if(!err){
            res.send(body);
        }
    });
});

//get other rooms
app.get('/getAnotherRooms', function (req, res) {
    var login = req.query.login;
    const options = {  
        url: 'http://localhost:8092/getAnotherRooms?login='+login,
        method: 'GET',
        body:login,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function(err, ress, body) {  
        
        if(!err){
            res.send(body);
        }
    });
});

//add Message
app.post('/sendMessage', function (req, res) {
    var salon = req.query.nomSalon;
    console.log(salon)
    var message = req.query.message;
    var login = req.query.login;
    const options = {  
        url: 'http://localhost:8092/sendMessage?login='+login+"&salon="+salon+"&message="+message,
        method: 'POST',
        body:login,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function(err, ress, body) {  
      
        if(!err){
            res.send(body);
        }
    });
});


//get messages rooms
app.get('/getMessagesSalon', function (req, res) {
    var login = req.query.login;
    var salon = req.query.salon;
    const options = {  
        url: 'http://localhost:8092/getMessagesSalon?login='+login+"&salon="+salon,
        method: 'GET',
        body:login,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function(err, ress, body) {  
        if(!err){
            res.send(body);
        }
    });
});

//get rooms
app.get('/getRooms', function (req, res) {
     var login = req.query.login;
    var salon = req.query.salon;
    const options = {  
        url: 'http://localhost:8092/getRooms',
        method: 'GET',
        body:login,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function(err, ress, body) {  
    
        if(!err){
            res.send(body);
        }
    });
});

//unSubscribe
app.post('/unSubscribe', function (req, res) {
    var login = req.query.login;
    const options = {  
        url: 'http://localhost:8092/unSubscribe?login='+login,
        method: 'POST',
        body:login,
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function(err, ress, body) {  
     
        if(!err){
            res.send(body);
        }
    });
});






app.listen(8000);
