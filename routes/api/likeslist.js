const express = require('express')
const Place = require('../models/Place')
const auth = require('../middleware/auth')

const router = express.Router();

// @route    GET /place
// @access   Private
router.get('/', auth, async (req, res, next) => {
  try {
    const usermail = req.user.email
    const place = await Place.find ({ "userlike.email": usermail } ) 
    res.json(place)
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})

module.exports = router