const express = require('express')
const User = require('../../models/user')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const { request } = require('express')


// @route    POST /user (funcionando)
// @desc     CREATE user
// @access   Public

router.post('/',[
  check('nome', 'Por favor insira seu.').not().isEmpty(),
  check('email', 'O e-mail não é válido.').isEmail(),
  check('password', 'Por favor, insira uma senha de 6 ou mais caracteres.').isLength({ min: 6 })  

], async (req, res, next) => {
  try{
    let { nome, email, password, is_active, is_admin } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }else{
      let user = new User({nome, email, password, is_active, is_admin})

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      
      await user.save()      
      if (user.id){
        res.json(user);
      }
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    GET /user (funcionando)
// @desc     LIST user
// @access   Private 

router.get('/', auth, async(req, res, next)=> {
  try{
    const user = await User.find({})
    res.json(user)
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    GET /user/:email (funcionando)
// @access   Public

router.get('/:email', auth, [], async(req, res, next)=> {
  try{
    let param_email = req.params["email"]
    const user = await User.findOne({email : param_email})
    if(user){
      res.json(user)
    }else{
      res.status(404).send({"error" : "Funcionario não encontrado"})
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    PATCH /user/:email (funcionando)
// @desc     PARTIAL EDIT user
// @access   Public

router.patch('/:email', [], async(req, res, next) => {
  try{
    const errors = validationResult(request)
    if (!errors.isEmpty()){
      res.status(400).send({ errors: errors.array() })
      return
    }
    let param_email = req.params["email"]
    const salt = await bcrypt.genSalt(10)

    let body_request = req.body

    if (body_request.password) {
      body_request.password = await bcrypt.hash(body_request.password, salt)
    }
    let update = {$set: body_request}    
    let user = await User.findOneAndUpdate({email : param_email}, update, {new: true})
    if(user){
      res.status(202).send({"success": "Usuário editado com sucesso"})
    }else{
      res.status(404).send({"error" : "Usuário não encontrado"})
    }
    
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    DELETE /user/:userId
// @desc     DELETE user
// @access   Public

router.delete('/:email', async(req, res, next) => {
  try {
    let param_email = req.params["email"]
    const user = await User.findOneAndDelete({email: param_email})
    if (user) {
      res.status(202).send({"success": "Usuário deletado com sucesso"})
    } else {
      res.status(404).send({"error": "Usuário não encontrado"})
    }  
  } catch (err) {
    console.log(err.message)
    res.status(500).send({"error": "Server error"})
  }
})



module.exports = router;