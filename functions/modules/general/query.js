const config = require('../../config.json');
const pgp = require('pg-promise')()
var db = pgp(config.pgp)


exports.select = async (query, table, where = {}, order = {}) => {
    return new Promise(async (resolve, reject) => {
        let whereStatement = Object.keys(where).length ? (`WHERE ${await genWhere(where)}`) : ''
        let orderStatement = Object.keys(order).length ? (`ORDER BY ${await genOrder(order)}`) : ''
        config.env === 'dev' ? console.log(`SELECT ${await genSelect(query)} FROM ${config.env}.${table} ${whereStatement} ${orderStatement}`) : ''
        db.any(`SELECT ${await genSelect(query)} FROM ${config.env}.${table} ${whereStatement} ${orderStatement}`)
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

exports.delete = (table, where) => {
    return new Promise(async (resolve, reject) => {
        config.env === 'dev' ? console.log(`DELETE FROM ${config.env}.${table} WHERE ${await genWhere(where)}`) : ''
        db.any(`DELETE FROM ${config.env}.${table} WHERE ${await genWhere(where)}`)
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

exports.insert = (table, value) => {
    return new Promise(async (resolve, reject) => {
        let extract_data = await getKeyValue(value)
        config.env === 'dev' ? console.log(`INSERT INTO ${config.env}.${table} (${extract_data['key']}) VALUES (${extract_data['value']})`) : ''
        db.any(`INSERT INTO ${config.env}.${table} (${extract_data['key']}) VALUES (${extract_data['value']})`)
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

exports.update = (table, value, where) => {
    return new Promise(async (resolve, reject) => {
        config.env === 'dev' ? console.log(`UPDATE ${config.env}.${table} SET ${await genUpdate(value)} WHERE ${await genWhere(where)}`) : ''
        db.any(`UPDATE ${config.env}.${table} SET ${await genUpdate(value)} WHERE ${await genWhere(where)}`)
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

exports.join = (query, table, join_table, condition, where = {}, order = {}) => {
    return new Promise(async (resolve, reject) => {
        let whereStatement = Object.keys(where).length ? (`WHERE ${await genWhere(where)}`) : ''
        let orderStatement = Object.keys(order).length ? (`ORDER BY ${await genOrder(order)}`) : ''
        config.env === 'dev' ? console.log(`SELECT ${await genSelect(query)} FROM ${config.env}.${table} INNER JOIN ${config.env}.${join_table} 
        ON (${await genOn(condition)}) ${whereStatement} ${orderStatement}`) : ''
        db.any(`SELECT ${await genSelect(query)} FROM ${config.env}.${table} INNER JOIN ${config.env}.${join_table} 
        ON (${await genOn(condition)}) ${whereStatement} ${orderStatement}`)
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

exports.any = (query) => {
    return new Promise(async (resolve, reject) => {
        config.env === 'dev' ? console.log(query) : ''
        db.any(query)
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

async function genOn(str) {
    var strStatement = '',
        index = 0
    for (var key in str) {
        strStatement += (index ? ` AND ${key}=${str[key]}` : `${key}=${str[key]}`)
        index++
    }
    return strStatement
}

async function genWhere(str) {
    var strStatement = '',
        index = 0
    for (var key in str) {
        strStatement += (index ? ` AND ${key}=${await atot(str[key])}` : `${key}=${await atot(str[key])}`)
        index++
    }
    return strStatement
}

async function genUpdate(str) {
    var strStatement = '',
        index = 0
    for (var key in str) {
        strStatement += (index ? `, ${key}=${await atot(str[key])}` : `${key}=${await atot(str[key])}`)
        index++
    }
    return strStatement
}

async function genOrder(str) {
    var strStatement = '',
        index = 0
    for (var key in str) {
        strStatement += (index ? `, ${key} ${str[key]}` : `${key} ${str[key]}`)
        index++
    }
    return strStatement
}

async function genSelect(arr) {
    return arr.reduce((sum, str, index) => {
        return sum + (index ? `, ${str}` : str)
    }, '')
}

async function getKeyValue(obj) {
    var valueStr = '',
        keyStr = '',
        index = 0
    for (var key in obj) {
        keyStr += (index ? `, ${key}` : key)
        valueStr += (index ? `, ${await atot(obj[key])}` : await atot(obj[key]))
        index++
    }
    return {
        'key': keyStr,
        'value': valueStr
    }
}

async function atot(val) {
    return typeof val === 'string' ? `'${val}'` : val
}