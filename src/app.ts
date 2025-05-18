import "reflect-metadata"
import 'dotenv/config'
import fastify, {FastifyInstance} from 'fastify';
import registrationRoute  from './modules/signup/registration.route';
import authenticationRoute from "./modules/auth/authentication.route";
import testRoute from "./modules/test/test.route";
import RouteVersion from './shared/enums/route.config.enum';
import bootstrapApp from "./bootstrap";
import RedisClient from "./shared/implementations/cache/redis/redis.client";
import { container } from "tsyringe";
const express = require('express');
const User = require('./model/users');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const TiktokStrategy = require('passport-tiktok-auth').Strategy;
// routing func setup
const router = express.Router();

class App {
  private fastify: FastifyInstance;

  constructor(){
    this.fastify = fastify({logger: false, bodyLimit: 1067008})

    this.registerModules();
    bootstrapApp();
  };

  private registerModules(){
    this.fastify.register(registrationRoute,  { prefix: RouteVersion['v1.register'] });
    this.fastify.register(authenticationRoute, {prefix: RouteVersion['v1.authentication']})
    this.fastify.register(testRoute, {prefix: RouteVersion['v1.test']})
  }

  public getInstance(){
    return this.fastify;
  };

  public async close() {
    await this.fastify.close();
    container.resolve(RedisClient).disconnect();
  };


  public listen(port: number,) {
    return this.fastify.listen({ port }, (err,  address = '0.0.0.0') => {
      if (err) {
        console.error(err)
        process.exit(0)
      }
      console.log(`Server listening at ${address}`)
    })
  }
};

export default App;


// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

// // Express Session
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false },
// }));

// app.use(passport.initialize());
// app.use(passport.session());





// MONGOOSE OPERATIONS 

// mongoose.connect(`mongodb+srv://deeno:${process.env.MONGODB_PASSWORD}@cluster0.zg4yvyq.mongodb.net/Wando_communications?retryWrites=true&w=majority`).then(function(){
//     console.log("Successfully connected to Wando database");

//   // Local Server Setup
//   const server = app.listen(process.env.PORT, function(){
//     console.log(`Wando app server running on ${process.env.PORT}`)
//   });

//   // I'm exporting the "server" variable to use in websocket functions within routes
//   module.exports = server;

//   // Socket.io Functions Route
// const useSocket = require("./socket");
// useSocket()

// }).catch((err: any)=>{
//     console.log(err);
// });


// // passport.use(User.createStrategy());


// // SERIALIZE AND DESERIALIZE USER

// // passport.serializeUser(User.serializeUser());
// // passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function(user: any, cb: any) {
//     process.nextTick(function() {
//       return cb(null, {
//         id: user.id,
//         username: user.username,
//         picture: user.picture
//       });
      
//     });
//   });
  
//   passport.deserializeUser(function(user: any, cb: (arg0: null, arg1: any) => any) {
//     process.nextTick(function() {
//       return cb(null, user);
//     });
//     // console.log(user)
//   });
  




// // -------- GOOGLE SIGN-IN AUTHOURIZATION ------- //
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "https://wando.onrender.com/auth/google/wando",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//     },
//     function(accessToken: any, refreshToken: any, profile: { id: any; name: { givenName: any; }; }, cb: (arg0: any, arg1: any) => any) {
//         User.findOrCreate({ googleId: profile.id }, function (err: any, user: { username: string; save: () => void; }) {

//                 // function to set a default app username
//           User.find({username: profile.name.givenName}).then(function(found: string | any[]) {
//             if (user.username) {
//               console.log("this account has already been registered and has a username")
//             }else{
//               if (found.length > 0) {
//                 let newName = (profile.name.givenName) + (Math.floor((Math.random() * 100)+ 1)).toString();
//                 user.username = newName;
//                 user.save();
//               } else {
//                 user.username = profile.name.givenName;
//                 user.save();
//               }
//               console.log("new account created and/or username added")
//             }
//           });

//           return cb(err, user);
//         })
//       }

//     ));


// // -------- FACEBOOK SIGN-IN AUTHOURIZATION --------- //
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "https://wando.onrender.com/auth/facebook/wando"
//   },
//   function(accessToken: any, refreshToken: any, profile: { id: any; displayName: any; }, cb: (arg0: any, arg1: any) => any) {
//     User.findOrCreate({ facebookId: profile.id }, function (err: any, user: { username: string; save: () => void; }) {

//       // function to set a default app username
//       User.find({username: (profile.displayName).split(" ")[0]}).then(function(found: string | any[]){
//         if(user.username){
//           console.log("this account has already been registered and has an username")
//         }else{
//           if (found.length>0) {
//             let newName = ((profile.displayName).split(" ")[0]) + (Math.floor((Math.random() * 100)+ 1)).toString();
//             user.username = newName;
//             user.save()
//           } else {
//             user.username = (profile.displayName).split(" ")[0];
//             user.save();
//           }
//           console.log("new account created and/or username added")
//         }
//       });

//       return cb(err, user);
//     });

//   }
// ));


// // -------- TWITTER SIGN-IN AUTHOURIZATION --------- //
// passport.use(new TwitterStrategy({
//     consumerKey: process.env.TWITTER_CONSUMER_API_KEY,
//     consumerSecret: process.env.TWITTER_CONSUMER_API_KEY_SECRET,
//     callbackURL: "https://wando.onrender.com/auth/twitter/wando"
//   },
  
//   function(token: any, tokenSecret: any, profile: { id: any; _json: { screen_name: any; }; }, cb: (arg0: any, arg1: any) => any) {
//     User.findOrCreate({ twitterId: profile.id }, function (err: any, user: { username: string; save: () => void; }) {

//       // function to set a default app username
//       User.find({username: profile._json.screen_name}).then(function(found: string | any[]){
//         if (user.username) {
//           console.log("this account has already been registered and has an username")
//         } else {
//           if (found.length>0) {
//             let newName = (profile._json.screen_name) + (Math.floor((Math.random() * 100)+ 1)).toString();
//             user.username = newName;
//             user.save();
//           } else {
//             user.username = profile._json.screen_name;
//             user.save();
//           }
//           console.log("new account created and/or username added")
//         }
//       })

//       return cb(err, user);
    
//     });
    
//   },
// ));



// // -------- TIKTOK SIGN-IN AUTHOURIZATION --------- //

// passport.use(new TiktokStrategy({
//   clientID: process.env.TIKTOK_CLIENT_KEY,
//   clientSecret: process.env.TIKTOK_CLIENT_SECRET,
//   scope: ['user.info.basic'],
//   callbackURL: "https://wando.onrender.com/auth/tiktok/wando"
// },
// function(accessToken: any, refreshToken: any, profile: { id: any; }, done: (arg0: any, arg1: any) => any) {
//   User.findOrCreate({ tiktokId: profile.id }, function (err: any, user: any) {
//       return done(err, user);
//   });
// }
// ));






// // ------THIRD-PARTY APPS AUTH REGISTRATION ROUTES ---- //
// const authRoute =  require('./routes/auth');
// app.use('/auth', authRoute);


// // Root - Route
// app.get("/", function(req: any, res:any){
//     res.send(`wando app working`);
// });

// // Register Route
// app.get("/register", function(req: any, res: any){
//     res.render('register');
// });


// // Sign Up Route
// const signupRoute = require('./routes/signup');
// app.use('/signup', signupRoute);


// // Log In Route
// const loginRoute = require('./routes/login');
// app.use('/login', loginRoute);


// // Homepage Route
// const homepageRoute = require('./routes/homepage');
// app.use('/home', homepageRoute);


// // Post Upload Route
// const postRoute = require('./routes/post');
// app.use('/upload', postRoute);


// // Messages Route
// const messagesRoute = require('./routes/messages');
// app.use('/messages', messagesRoute);


// // Chatroom Route
// const chatroomRoute = require('./routes/chatroom');
// app.use('/chat', chatroomRoute);

// // Profile Route
// const profileRoute = require('./routes/profile');
// app.use('/profile', profileRoute);

// // Profile Edit Route
// const profileEditRoute = require('./routes/profileedit');
// app.use('/profileedit', profileEditRoute);


// // Discover Route
// const discoverRoute = require('./routes/discover');
// app.use('/discover', discoverRoute);
