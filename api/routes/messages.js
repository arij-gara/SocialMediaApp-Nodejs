const router = require('express').Router()
const Message = require('../models/message')

//add message 

router.post ('/',  async(req,res) => { 
    const newmessage = new Message(req.body)
    try{ 
   const savedmessage = await newmessage.save()
   res.status(200).json(savedmessage)
    }catch(err) {
        res.status(500).json(err)
    }
})

//get coversation of a user

router.get('/:conversationId', async(req,res)=>{
    try{
    const messages = await  Message.find({
        conversationId : req.params.conversationId
    })
    res.status(200).json(messages)

    }catch(err){
        res.status(500).json(err)
    }
})




module.exports= router