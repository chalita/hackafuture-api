const getUuid = require('uuid-by-string')
const db = require('./general/query')

uuid = (uid) => {
  return getUuid(uid + Date.now())
}

exports.getInventoryItem = (req, res, decoded) => {
  let param = req.query
  db.select(['*'], 'inventory_item', {
    user_uid : decoded.uid
  })
      .then(doc => res.status(200).send(doc))
      .catch(err => res.status(400).send(err))
}

exports.addInventoryItem = (req, res, decoded) => {
  let data = req.body
  db.insert('inventory_item', {
          'title': data.title,
          'description': data.description ? data.description : '',
          'create_at': Date.now().toString(),
          'update_at': Date.now().toString()
      })
      .then(doc => res.status(200).send())
      .catch(err => res.status(400).send(err))
}

exports.deleteInventoryItem = (req, res, decoded) => {
  let data = req.query
  db.delete('inventory_item', {
          'id': data.id,
      })
      .then(doc => res.status(200).send())
      .catch(err => res.status(400).send(err))
}

exports.setInventoryItem = (req, res, decoded) => {
  let data = req.body
  data['update_at'] = Date.now().toString()
  db.update('inventory_item', data, {
          'id': data.id
      })
      .then(doc => res.status(200).send(doc))
      .catch(err => res.status(400).send(err))
}