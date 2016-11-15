module.exports = () => {
  const router = require('express').Router()
  const utils = require('../utils')
  const config = require('../config')
  const crypto = require('crypto')

  // Home page is login
  router.get('/', (req, res, next) => {
    var n = Math.floor((Math.random()*4));
    res.render('login', {
      //selected="selected"
      a: n == 0,
      b: n == 1,
      c: n == 2,
      d: n == 3
      
    })
  })


  router.get('/rooms', utils.isAuthenticated, (req, res, next) => {
    res.render('rooms', {
      user: req.session.user,
      host: config.host,
      affiliation: req.session.user.affiliation
    })
  })

  

  router.get('/chat/:id', utils.isAuthenticated, (req, res, next) => {
    // Find a chatroom with the given id
    let getRoom = utils.findRoomById(req.app.locals.chatrooms, req.params.id)
    if (getRoom === undefined) {
      // 404
      return next()
    } else {
      res.render('chatroom', {
        user: req.session.user,
        host: config.host,
        room: getRoom.room,
        roomID: getRoom.roomID
      })
    }
  })

  router.post('/auth/login', (req, res) => {

    req.session.user = {
      profileId: utils.randomHex(),
      fullName: req.body.username,
      profilePic: 'https://unsplash.it/100/?image=' + (parseInt(crypto.createHash('md5').update(req.body.username).digest("hex").split("").filter(c => c.charCodeAt(0) >= 0x30 && c.charCodeAt(0) < 0x40).splice(0,10).join("")) % 1000),
      affiliation: req.body.affiliation
    }
    req.session.isAuthenticated = true

    res.redirect('/rooms')
  })

  // logout
  router.get('/logout', (req, res, next) => {

    req.session.user = null
    req.session.isAuthenticated = false
    res.redirect('/')
  })

  return router
}
