var User = require('./models/user');
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var url = "mongodb://localhost/GoogleSingin";
module.exports = function(app, passport){
    app.get('/', function (req, res){
        res.render('index.ejs');
    });
    app.get('/signup', function(req, res){
        res.render('singup.ejs', { message: req.flash('singupMessage')});
    });
    app.get('/login', function(req, res){
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.post('/signup', passport.authenticate('local-singup',{
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true

    }));


    app.get('/profile', isLogedIn, function(req, res){
        res.render('profile.ejs', { user:req.user});
    });
    //querys
    app.get('/all', isLogedIn, function (req, res){
        var resultArray = [];
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            var cursor = db.collection("users").find();
            cursor.forEach(function(doc, err){
                resultArray.push(doc);
                console.log(resultArray);
            }, function(){
                client.close();
                res.render('all', {items: resultArray});
            });
           
          }); 
    });
    app.get('/email', isLogedIn, function(req, res){
        var resultArray  = [];
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            var query = { username: "stevan" };
            var cursor = db.collection("users").find(query);
            cursor.forEach(function(doc, err){
                resultArray.push(doc);
                console.log(resultArray);
            }, function(){
                client.close();
                res.render('email', {items: resultArray});
            });
           
          });
                
    });
    app.get('/sort',  isLogedIn, function(req, res){
        var resultArray = [];
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            var mysort = { username: 1 };
            var cursor = db.collection("users").find().sort(mysort);
            cursor.forEach(function(doc, err){
                resultArray.push(doc);
                console.log(resultArray);
            }, function(){
                client.close();
                res.render('sort', {items: resultArray});
            });
           
          }); 
    });
    app.get('/pass', function(req, res){
        res.render('update.ejs');
    });
    app.post('/pass', function(req, res){
        var id = req.body.email;
        var newPassword = req.body.password;
        console.log('id'+ id + ' ' + 'newPassword'+ newPassword);
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');

            db.collection('users').update({"username": id}, { $set: { "password": newPassword}},
            	function(err, result){
                        console.log('update success');
                        client.close();
                        res.redirect('/login');
                });
                     
           
        });
      
    })
    app.get('/index',  isLogedIn, function(req, res){
        res.render('home.ejs');
    });
    
     app.get('/auth/google',
     passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

     
      app.get('/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/profile');
      });
      app.get('/logout',  isLogedIn,function(req, res){
          req.logout();
          res.redirect('/');
      })
      app.get('/home',  isLogedIn, function(req, res){
          res.render('home');
      });
      app.get('/about',  isLogedIn, function(req, res){
        res.render('about');
    });
    app.get('/track',  isLogedIn, function(req, res){
        res.render('track');
    });
    app.post('/cst', isLogedIn, function(req, res, next){
        var item ={
            name: req.body.name,
            lastname: req.body.lastname,
            address: req.body.address,
            vehicle: req.body.vehicle,
            contactEmail: req.body.conemail,
            contactNum: req.body.connum,
            startDate: req.body.date,
            track: 'CanningStockRoute',
            username: req.user
        };
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            
                db.collection('tracks').insertOne(item, function(err, result){
                    console.log('Data Inserted');
                    client.close();
                });
                       
          });
          var pom = "asdasd";
        res.render('csr');
    });
    app.get('/allcsr', function(req, res){
        var resultArray = [];
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            var query = { track: "CanningStockRoute" };
            var cursor = db.collection("tracks").find(query);
            cursor.forEach(function(doc, err){
                resultArray.push(doc);
                console.log(resultArray);
                
            }, function(){
                client.close();
                res.render('show', {items: resultArray, name: "Canning Stock Route"});
            });
           
          });
    });
    app.post('/ht',isLogedIn, function(req, res, next){
        var item ={
            name: req.body.name,
            lastname: req.body.lastname,
            address: req.body.address,
            vehicle: req.body.vehicle,
            contactEmail: req.body.conemail,
            contactNum: req.body.connum,
            startDate: req.body.date,
            track: 'HollandTrack',
            username: req.user
        };
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            
                db.collection('tracks').insertOne(item, function(err, result){
                    console.log('Data Inserted');
                    client.close();
                    res.render('holland');
                });
                       
          });
    });
    app.get('/allht', function(req, res){
        var resultArray = [];
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            var query = { track: "HollandTrack" };
            var cursor = db.collection("tracks").find(query);
            cursor.forEach(function(doc, err){
                resultArray.push(doc);
                console.log(resultArray);
                
            }, function(){
                client.close();
                res.render('show', {items: resultArray, name: "Holland track"});
            });
           
          });
    });
    app.post('/lt',isLogedIn, function(req, res, next){
        var item ={
            name: req.body.name,
            lastname: req.body.lastname,
            address: req.body.address,
            vehicle: req.body.vehicle,
            contactEmail: req.body.conemail,
            contactNum: req.body.connum,
            startDate: req.body.date,
            track: 'LowTrack',
            username: req.user
        };
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            
                db.collection('tracks').insertOne(item, function(err, result){
                    console.log('Data Inserted');
                    client.close();
                    res.render('low', {items: item });
                });
                       
          });
    });
    app.get('/alllt', function(req, res){
        var resultArray = [];
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            var query = { track: "LowTrack" };
            var cursor = db.collection("tracks").find(query);
            cursor.forEach(function(doc, err){
                resultArray.push(doc);
                console.log(resultArray);
                
            }, function(){
                client.close();
                res.render('show', {items: resultArray, name: "700km in low range"});
            });
           
          });
    });
    app.post('/dt',isLogedIn, function(req, res, next){
        var item ={
            name: req.body.name,
            lastname: req.body.lastname,
            address: req.body.address,
            vehicle: req.body.vehicle,
            contactEmail: req.body.conemail,
            contactNum: req.body.connum,
            startDate: req.body.date,
            track: 'DollarTrack',
            username: req.user
        };
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            
                db.collection('tracks').insertOne(item, function(err, result){
                    console.log('Data Inserted');
                    client.close();
                    res.render('dolar', {items: ''});
                });
                       
          });
    });
    app.get('/alldt', function(req, res){
        var resultArray = [];
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            var query = { track: "DollarTrack" };
            var cursor = db.collection("tracks").find(query);
            cursor.forEach(function(doc, err){
                resultArray.push(doc);
                console.log(resultArray);
                
            }, function(){
                client.close();
                res.render('show', {items: resultArray, name: "$1000 track"});
            });
           
          });
    })
    app.get('/contact',  isLogedIn, function(req, res){
        res.render('contact');
    });
    app.post('/contact',isLogedIn, function(req, res){
        var item = {
            name: req.body.name,
            lastname: req.body.lastname,
            contactNum: req.body.connum,
            msg: req.body.msg,
            username: req.user
        }
        MongoClient.connect('mongodb://localhost', function (err, client) {
            if (err) throw err;
            var db = client.db('GoogleSingin');
            
                db.collection('message').insertOne(item, function(err, result){
                    console.log('Data Inserted');
                    client.close();
                    res.render('contact' );
                });
                       
          });
    });
    app.get('/csr',  isLogedIn, function(req, res){
        res.render('csr', {items: ''});
    });
    app.get('/ht',  isLogedIn, function(req, res){
        res.render('holland', {items: ''});
    });
    app.get('/dt',  isLogedIn, function(req, res){
        res.render('dolar', {items: ''});
    });
    app.get('/lt',  isLogedIn, function(req, res){
        res.render('low', {items: ''});
    });
}

function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}