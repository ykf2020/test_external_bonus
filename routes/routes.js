const express = require('express');
const router = express.Router()

const Model = require('../models/model');


//get bonus info
router.get('/bonus', (req, res) => {
  const customer_id = req.query.customer_id
  const email = req.query.email
  
  // 故意拖久一點 目前設3秒
  setTimeout(async () => {
    try {
      const user = await Model.findOne({customer_id, email});
      if(!user) {
        //create user
        const newUser = new Model({
          customer_id,
          email,
          bonus_points: 6000
        })
        const user = await newUser.save()
        res.status(200).json({status:'Success', bonus_points: user.bonus_points})
      } else {
        res.status(200).json({status:'Success',bonus_points: user.bonus_points})
      }
    }
    catch(error){
        res.status(500).json({status:'Fail', message: error.message})
    }
  }, 3000)
})

// order create webhook
router.post('/orders/create', async (req, res) => {
  const customer_id = req.body.customer.id
  const email = req.body.customer.email
  const bonus_consumed = Number(req.body.prices.discounts.bonus_consumed)
  
  try {
    const user = await Model.findOne({customer_id, email});
    if(!user) {
      res.status(200).json(`this user ${customer_id} not synced yet`)
    } else {
      const new_bonus = user.bonus_points - bonus_consumed
      await Model.findOneAndUpdate({customer_id, email}, {bonus_points: new_bonus});
      res.status(200).json('updated')
    }
  }
  catch(error) {
    res.status(500).json({message: error.message})
  } 
})

// order cancelled webhook
router.post('/orders/cancelled', async (req, res) => {
  const customer_id = req.body.customer.id
  const email = req.body.customer.email
  const bonus_consumed = Number(req.body.prices.discounts.bonus_consumed)

  try {
    const user = await Model.findOne({customer_id, email});
    if(!user) {
      res.status(200).json(`this user ${customer_id} not synced yet`)
    } else {
      const new_bonus = user.bonus_points + bonus_consumed
      await Model.findOneAndUpdate({customer_id, email}, {bonus_points: new_bonus});
      res.status(200).json('updated')
    }
  }
  catch(error) {
    res.status(500).json({message: error.message})
  } 
})

// order returned webhook
router.post('/orders/returned', async (req, res) => {
  const customer_id = req.body.customer.id
  const email = req.body.customer.email
  const bonus_consumed = Number(req.body.prices.discounts.bonus_consumed)
  
  try {
    const user = await Model.findOne({customer_id, email});
    if(!user) {
      res.status(200).json(`this user ${customer_id} not synced yet`)
    } else {
      const new_bonus = user.bonus_points + bonus_consumed
      await Model.findOneAndUpdate({customer_id, email}, {bonus_points: new_bonus});
      res.status(200).json('updated')
    }
  }
  catch(error) {
    res.status(500).json({message: error.message})
  } 
})


module.exports = router;