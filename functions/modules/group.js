const getUuid = require('uuid-by-string')
const db = require('./general/query')

var _this = this

uuid = (uid) => {
    return getUuid(uid + Date.now())
}

// Group Type //

exports.getGroupType = (req, res, decoded) => {
    db.select(['*'], 'group_type')
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}

exports.addGroupType = (req, res, decoded) => {
    let data = req.body
    db.insert('group_type', {
            'title': data.title,
            'description': data.description ? data.description : '',
            'create_at': Date.now().toString(),
            'update_at': Date.now().toString()
        })
        .then(doc => res.status(200).send())
        .catch(err => res.status(400).send(err))
}

exports.deleteGroupType = (req, res, decoded) => {
    let data = req.query
    db.delete('group_type', {
            'id': data.id,
        })
        .then(doc => res.status(200).send())
        .catch(err => res.status(400).send(err))
}

exports.setGroupType = (req, res, decoded) => {
    let data = req.body
    data['update_at'] = Date.now().toString()
    db.update('group_type', data, {
            'id': data.id
        })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}

// End Group Type //

// Group Role //

exports.getGroupRole = (req, res, decoded) => {
    db.select(['*'], 'group_role')
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}

exports.addGroupRole = (req, res, decoded) => {
    let data = req.body
    db.insert('group_role', {
            'title': data.title,
            'description': data.description ? data.description : '',
            'create_at': Date.now().toString(),
            'update_at': Date.now().toString()
        })
        .then(doc => res.status(200).send())
        .catch(err => res.status(400).send(err))
}

exports.deleteGroupRole = (req, res, decoded) => {
    let data = req.query
    db.delete('group_role', {
            'id': data.id,
        })
        .then(doc => res.status(200).send())
        .catch(err => res.status(400).send(err))
}

exports.setGroupRole = (req, res, decoded) => {
    let data = req.body
    data['update_at'] = Date.now().toString()
    db.update('group_role', data, {
            'id': data.id
        })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}

// End Group Role //

// Group //

exports.getGroup = (req, res, decoded) => {
    db.join(['groups.title AS title', 'groups.description AS description', 'group_type.title AS type'], 'groups', 'group_type', {
            "groups.group_type_id": "group_type.id"
        })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.addGroup = (req, res, decoded) => {
    let data = req.body
    let group_uid = uuid(decoded.uid)
    db.insert('groups', {
            'uid': group_uid,
            'title': data.title,
            'description': data.description ? data.description : '',
            'group_type_id': data.group_type_id,
            'create_at': Date.now().toString(),
            'update_at': Date.now().toString()
        })
        .then(() => {
            db.insert('group_member', {
                    'uid': decoded.uid,
                    'group_uid': group_uid,
                    'group_role_id': 1,
                    'create_at': Date.now().toString(),
                    'update_at': Date.now().toString()
                })
                .then(doc => {
                    res.status(200).send(doc)
                })
                .catch(err => {
                    console.log(err)
                    _this.deleteGroup({
                        'uid': group_uid
                    }, res, decoded.uid)
                })
        })
        .catch(err => res.status(400).send(err))
}
exports.setGroup = (req, res, decoded) => {
    let data = req.body
    data['update_at'] = Date.now().toString()
    db.update('groups', data, {
            'uid': data.uid
        })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.deleteGroup = (req, res, decoded) => {
    let data = req.query
    db.delete('groups', {
            'uid': data.uid,
        })
        .then(doc => res.status(200).send())
        .catch(err => res.status(400).send(err))
}

// End Group //

// Group Member //

exports.getGroupMember = (req, res, decoded) => {
    let data = req.query
    db.join(['users.display_name AS display_name'], 'group_member', 'users', {
            "users.uid": "group_member.uid"
        }, {
            'group_member.group_uid': data.group_uid
        })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.addGroupMember = (req, res, decoded) => {
    let data = req.body
    db.insert('group_member', {
            'uid': decoded.uid,
            'group_uid': data.group_uid,
            'group_role_id': data.group_role_id,
            'create_at': Date.now().toString(),
            'update_at': Date.now().toString()
        })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.setGroupMember = (req, res, decoded) => {
    let data = req.body
    data['update_at'] = Date.now().toString()
    db.update('group_member', data, {
            'uid': data.uid,
            'group_uid': data.group_uid
        })
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(err))
}
exports.deleteGroupMember = (req, res, decoded) => {
    let data = req.query
    db.delete('group_member', {
            'uid': data.uid,
        })
        .then(doc => res.status(200).send())
        .catch(err => res.status(400).send(err))
}

// End Group Member //