const getUuid = require('uuid-by-string')
const db = require('./general/query')
uuid = (uid) => {
    return getUuid(uid + Date.now())
}

exports.getCommetByPostId = (req,res,decoded)=>{
    db.select(['*'],'comment',{
        'post_uid': req.query.post_id
    },{
        'create_at': 'DESC'
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.createComment = (req, res, decoded) => {
    let param = JSON.parse(req.body)
    db.insert('comment',{
        'uid':uuid(decoded.uid),
        'detail':param.detail,
        'post_uid':param.post_id,
        'user_uid':decoded.uid,
        'create_at':Date.now().toString()
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}
exports.updateComment = (req,res,decoded) =>{
    let param = JSON.parse(req.body)
    db.update('comment',{
        'detail':param.detail,
        'update_at':Date.now().toString()
    },{
        'uid':param.comment_id,
        'user_uid':decoded.uid
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.deleteComment = (req,res,decoded)=>{
    let param = req.query
    db.delete('comment',{
        'uid':param.comment_id
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
} 
