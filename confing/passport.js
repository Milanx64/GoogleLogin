var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport){

    passport.serializeUser(function(user, done){
        done(null, user.id);

    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-singup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

    function(req, email, password, done){
        process.nextTick(function(){
            //Upis u mongoDB
            User.findOne({'local.username': email}, function(err, user){
                if(err)
                    return done(err);
                    if(user){
                        return done(null, false, req.flash('singupMessage', 'That email is already taken'));
                    } else {
                        var newUser = new User();
                        newUser.local.username = email;
                        newUser. local.password = newUser.generateHash(password);
                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        })
                    }
            })
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email , password, done){
        process.nextTick(function(){
            //pretraga baze podataka
            User.findOne({ 'local.username': email}, function(err, user){
                if(err)
                    return done(err);
                if(!user)
                return done(null, false, req.flash('loginMessage', 'No User Found'));
                if(!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Invalid password'));
                return done(null, user);
            });
        });
    }));

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            User.findOne({'google.id': profile.id}, function(err, user){
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                else {
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    })
                    console.log(profile);
                }
            });
        });
       
    }));


};