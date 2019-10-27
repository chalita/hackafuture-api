const getUuid = require('uuid-by-string')
const db = require('./general/query')
uuid = (uid) => {
    return getUuid(uid + Date.now())
}

exports.likePost = (req,res, decoded) => {
    let param = JSON.parse(req.body);
    db.insert('like_post', {
        'uid': uuid(decoded.uid),
        'post_uid': param.post_id,
        'user_uid': decoded.uid,
        'type_like_id': parseInt(param.type)
    })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.likeComment = (req, res, decoded) => {
    let param = JSON.parse(req.body);
    db.insert('like_comment', {
        'uid': uuid(decoded.uid),
        'comment_uid': param.comment_id,
        'user_uid': decoded.uid,
        'like_type_id': parseInt(param.type)
    })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.likeReply = (req, res, decoded) => {
    let param = JSON.parse(req.body);
    db.insert('like_Reply', {
        'uid': uuid(decoded.uid),
        'reply_uid': param.reply_id,
        'user_uid': decoded.uid,
        'like_type_id': parseInt(param.type)
    })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.getlikeByPostId = (req,res,decoded)=>{
    let query = req.query
    let object ={}
    db.join(['like_post.user_uid','like_type.name As type'],'like_post','like_type',{
        'like_post.type_like_id':'like_type.id'   
    },{
        'post_uid': query.post_id,
        'user_uid': decoded.uid
    })
    .then(doc => {
        object.data = doc
        db.any(`SELECT COUNT(post_uid), dev.like_type.name FROM dev.like_post INNER JOIN dev.like_type ON  dev.like_post.type_like_id = dev.like_type.id WHERE post_uid = '${req.post_id}' GROUP BY dev.like_type.name` )
        .then(doc => {
            object.count = doc
            res.status(200).send(object)
        })
        .catch(err => res.status(400).send(err))
    }
       
    )
    .catch(err => res.status(400).send(err))
}