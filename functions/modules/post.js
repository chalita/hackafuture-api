const getUuid = require('uuid-by-string')
const db = require('./general/query')
uuid = (uid) => {
  return getUuid(uid + Date.now())
}

exports.createdPost = (req, res, decoded) => {
  let param = JSON.parse(req.body)
  db.insert('post',{
      'uid':uuid(decoded.uid),
      'detail': param.detail,
      'post_type_id': parseInt(param.type),
      'user_uid':decoded.uid,
      'image_post_uid':decoded.uid,
      'create_at': Date.now().toString()
  })
  .then(doc => res.status(200).send(doc))
  .catch(err => res.status(400).send(err))
}

exports.updatePost = (req, res, decoded) => {
  let param = JSON.parse(req.body)
  db.update('post',{
    'detail':param.detail,
    'update_at':Date.now().toString()
  },{
    'uid':param.id,
    'user_uid':decoded.uid
  })
  .then(doc => res.status(200).send(doc))
  .catch(err => res.status(400).send(err))
}

exports.deletePost = (req, res, decoded) => {
  let param = req.query
  db.delete('post',{
    'uid': param.id,
    'user_uid':decoded.uid
  })
  .then(doc => res.status(200).send(doc))
  .catch(err => res.status(400).send(err))
}

