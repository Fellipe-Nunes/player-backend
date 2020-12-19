const express = require('express')
const Place = require('../models/Place')
const router = express.Router()
const auth = require('../middleware/auth')

// @route    POST /education
// @desc     CREATE education
// @access   Private
router.post('/:placeId',auth, async (req, res, next) => {
  try {

    const id = req.params.placeId
    const usermail = req.user.email
    let tem = await Place.findById(id)
    let verifica = tem.userlike.filter(function(elem){
      return elem.email == usermail
    })
    if (verifica.length > 0) {
      res.status(401).json({error : "Esse lugar já tem seu like!"})
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})

module.exports = router