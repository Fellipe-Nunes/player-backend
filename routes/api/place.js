const express = require('express');
const Place = require('../../models/place');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const router = express.Router();


// @route    POST /place (funcionando)
// @desc     CREATE place
// @access   Public

router.post('/',[
  check('nome', 'Por favor, insira o seu nome.').not().isEmpty(),
     
], async (req, res, next) => {
  try{
    let { nome } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }else{
      let place = new Place({nome})
      
      await place.save()
      const payload = {
        place: {
          id: place.id
        }
      };
      if (place.id){
        res.json(place);
      }
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    GET /place (funcionando)
// @desc     LIST place
// @access   Private

router.get('/', async(req, res, next)=> {
  try{
    const place = await Place.find({})
    res.json(place)
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

// @route    GET /place/:nome (funcionando)
// @desc     DETAIL place
// @access   Private

router.get('/:nome', auth, [], async(req, res, next)=> {
  try{
    let param_nome = req.params["nome"]
    const Place = await Place.findOne({nome : param_nome})
    if(nome){
      res.json(nome)
    }else{
      res.status(404).send({"error" : "Lugar não encontrado"})
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
}) 


// @route    PATCH /place/:nome (funcionando)
// @desc     PARTIAL EDIT place
// @access   Public

router.patch('/:nome', [], async(req, res, next) => {
  try{
    let param_nome = req.params["nome"]
    let body_request = req.body
    let update = {$set: body_request}
    
    let place = await Place.findOneAndUpdate({nome : param_nome}, update, {new: true})
    if(place){
      res.status(202).send({"success": "Lugar editado com sucesso"})
    }else{
      res.status(404).send({"error" : "Lugar não encontrado"})
    }
    
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

// @route    DELETE /place/:userId
// @desc     DELETE place
// @access   Public

router.delete('/:nome', async(req, res, next) => {
  try {
    let param_nome = req.params["nome"]
    const place = await Place.findOneAndDelete({nome: param_nome})
    if (place) {
      res.status(202).send({"success": "Lugar deletado com sucesso"})
    } else {
      res.status(404).send({"error": "Lugar não encontrado"})
    }  
  } catch (err) {
    console.log(err.message)
    res.status(500).send({"error": "Server error"})
  }
})

module.exports = router