const functions = require('firebase-functions').region('asia-northeast1')
const admin = require('firebase-admin')
const config = require('./config.json');
const express = require('express');
const cors = require('cors');
const app = express();
const userModule = require('./modules/user');
const postModule = require('./modules/post');
const groupModule = require('./modules/group');
const inventoryModule = require('./modules/inventory');
const commentModule = require('./modules/comment');
const likeModule = require('./modules/like');
const replyModule = require('./modules/reply');


admin.initializeApp(config)
app.use(cors({
  origin: true
}));

exports.createUser = functions.auth.user().onCreate(user => {
  return userModule.createUser(user)
});
exports.deleteUser = functions.auth.user().onDelete(user => {
  return userModule.deleteUser(user)
});
exports.api = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})


app.get('/user', (req, res) => {return verifyIdToken(req, res, userModule.getUserProfile)});
app.patch('/user', (req, res) => {return verifyIdToken(req, res, userModule.setUserProfile)});
app.get('/user/follow', (req, res) => {return verifyIdToken(req, res, userModule.getFollowing)});
app.post('/user/follow', (req, res) => {return verifyIdToken(req, res, userModule.addFollowing)});
app.delete('/user/follow', (req, res) => {return verifyIdToken(req, res, userModule.unFollowing)});


app.get('/group', (req, res) => {return verifyIdToken(req, res, groupModule.getGroup)});
app.post('/group', (req, res) => {return verifyIdToken(req, res, groupModule.addGroup)});
app.patch('/group', (req, res) => {return verifyIdToken(req, res, groupModule.setGroup)});
app.delete('/group', (req, res) => {return verifyIdToken(req, res, groupModule.deleteGroup)});
app.get('/group/type', (req, res) => {return verifyIdToken(req, res, groupModule.getGroupType)});
app.post('/group/type', (req, res) => {return verifyIdToken(req, res, groupModule.addGroupType)});
app.patch('/group/type', (req, res) => {return verifyIdToken(req, res, groupModule.setGroupType)});
app.delete('/group/type', (req, res) => {return verifyIdToken(req, res, groupModule.deleteGroupType)});
app.get('/group/role', (req, res) => {return verifyIdToken(req, res, groupModule.getGroupRole)});
app.post('/group/role', (req, res) => {return verifyIdToken(req, res, groupModule.addGroupRole)});
app.patch('/group/role', (req, res) => {return verifyIdToken(req, res, groupModule.setGroupRole)});
app.delete('/group/role', (req, res) => {return verifyIdToken(req, res, groupModule.deleteGroupRole)});
app.get('/group/member', (req, res) => {return verifyIdToken(req, res, groupModule.getGroupMember)});
app.post('/group/member', (req, res) => {return verifyIdToken(req, res, groupModule.addGroupMember)});
app.patch('/group/member', (req, res) => {return verifyIdToken(req, res, groupModule.setGroupMember)});
app.delete('/group/member', (req, res) => {return verifyIdToken(req, res, groupModule.deleteGroupMember)});


app.get('/Inventory/item', (req, res) => {return verifyIdToken(req, res, inventoryModule.getInventoryItem)});
app.post('/Inventory/item', (req, res) => {return verifyIdToken(req, res, inventoryModule)});
app.patch('/Inventory/item', (req, res) => {return verifyIdToken(req, res, inventoryModule.setInventoryItem)});
app.delete('/Inventory/item', (req, res) => {return verifyIdToken(req, res, inventoryModule.deleteInventoryItem)});



app.post('/post',(req,res)=>{return verifyIdToken(req,res,postModule.createdPost)})
app.patch('/post',(req,res)=>{return verifyIdToken(req,res,postModule.updatePost)})
app.delete('/post',(req,res) =>{return verifyIdToken(req,res,postModule.deletePost)})

app.post('/like/post',(req,res) =>{return verifyIdToken(req,res,likeModule.likePost)})
app.post('/like/comment',(req,res) =>{return verifyIdToken(req,res,likeModule.likeComment)})
app.post('/like/reply',(req,res) =>{return verifyIdToken(req,res,likeModule.likeReply)})
app.get('/like/post',(req,res) =>{return verifyIdToken(req,res,likeModule.getlikeByPostId)})

app.get('/comment',(req,res) =>{return verifyIdToken(req,res,commentModule.getCommetByPostId)})
app.post('/comment',(req,res) =>{return verifyIdToken(req,res,commentModule.createComment)})
app.patch('/comment',(req,res) =>{return verifyIdToken(req,res,commentModule.updateComment)})
app.delete('/comment',( req,res) =>{return verifyIdToken(req,res,commentModule.deleteComment)})

app.get('/reply',(req,res)=>{return verifyIdToken(req,res,replyModule.getReplyByCommentId)})
app.post('/reply',(req,res)=>{return verifyIdToken(req,res,replyModule.createReply)})
app.patch('/reply',(req,res)=>{return verifyIdToken(req,res,replyModule.updateReply)})
app.delete('/reply',(req,res)=>{return verifyIdToken(req,res,replyModule.deleteReply)})



verifyIdToken = (req, res, fx) => {
  const tokenId = req.get('Authorization')
  return admin.auth().verifyIdToken(tokenId)
    .then((decoded) => fx(req,res,decoded))
    .catch((err) => res.status(400).send(err))
}