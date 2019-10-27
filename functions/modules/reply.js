const getUuid = require('uuid-by-string')
const db = require('./general/query')
uuid = (uid) => {
    return getUuid(uid + Date.now())
}

exports.getReplyByCommentId = (req,res,decoded)=>{
    let param = req.query
    db.select(['*'],'reply',{
        'comment_uid': param.comment_id
    },{
        'create_at': 'DESC'
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.createReply = (req,res,decoded) =>{
    let param = JSON.parse(req.body)
    db.insert('reply',{
        'uid':uuid(decoded.uid),
        'detail':param.detail,
        'comment_uid':param.comment_id,
        'user_uid':uid,
        'create_at':Date.now().toString()
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.updateReply = (req,res,decoded) =>{
    let param = JSON.parse(req.body)
    db.update('reply',{
        'detail':param.detail,
        'update_at':Date.now().toString()
    },{
        'uid':param.reply_id,
        'user_uid':decoded.uid
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.deleteReply = (req,res,decoded)=>{
    let param = req.query
    db.delete('reply',{
        'uid':param.reply_id
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
} 