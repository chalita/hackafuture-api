const db = require('./general/query')


exports.getUserProfile = (req, res, decoded) => {
  db.select(['*'], 'users', {
      'uid': decoded.uid
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.setUserProfile = (req, res, decoded) => {
  let data = req.body
  data['update_at'] = Date.now().toString()
  db.update('users', data, {
      'uid': decoded.uid
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.addFollowing = (req, res, decoded) => {
  let data = req.body
  let targetUid = data.targetUid
  db.insert('following', {
      'uid': targetUid,
      'user_uid': decoded.uid,
      'create_at': Date.now().toString(),
      'update_at': Date.now().toString()
    })
    .then(doc => res.status(200).send())
    .catch(err => res.status(400).send(err))
}

exports.unFollowing = (req, res, decoded) => {
  let data = req.body
  let targetUid = data.targetUid
  db.delete('following', {
      'uid': targetUid,
      'user_uid': decoded.uid
    })
    .then(doc => res.status(200).send())
    .catch(err => res.status(400).send(err))
}

exports.getFollowing = (req, res, decoded) => {
  db.join(['users.display_name'], 'following', 'users', {
      'following.uid': 'users.uid'
    }, {
      'following.user_uid': decoded.uid
    })
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(err))
}

exports.createUser = (user) => {
  db.insert('users', {
    'uid': user.uid,
    'display_name': user.displayName,
    'email': user.email,
    'phone_number': user.phoneNumber,
    'create_at': Date.now().toString(),
    'update_at': Date.now().toString()
  })
}

exports.deleteUser = (user) => {
  return db.delete('users', {
    'uid': user.uid
  })
}