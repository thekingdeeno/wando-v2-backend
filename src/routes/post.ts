 // @ts-nocheck 
import 'dotenv/config'
const express = require('express');
const socket = require('socket.io');
const ngrok = require("@ngrok/ngrok");
const User = require('../model/users');
const Post = require('../model/posts');
const Chat = require('../model/chat');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const findOrCreate = require('mongoose-findorcreate');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { ObjectId } = require("mongodb");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
// routing func setup
const router = express.Router();


router.get('/', function(req, res){

    if (req.isAuthenticated()) {
      async function render(){

      const thisUser = await User.findById((req.user).id)

        res.render('upload',{
          username: thisUser.username
        })        
      }
      render();

    } else {
      res.redirect('register');
    };
  });
  
router.post('/', function(req, res){
  
  
  
    User.findById((req.user).id).then(function(foundUser){
      const post = new Post({
      title: req.body.title,
      content: req.body.content,
      authorId: (req.user).id,
      authorUsername: foundUser.username,
    });
  
      post.save().then(function(){
        res.redirect('/home');
      }).catch(err=>{
        console.log(err);
      })
      foundUser.posts.push(post._id);
      foundUser.save();
  
    });
    
    
  
  });

  module.exports = router;