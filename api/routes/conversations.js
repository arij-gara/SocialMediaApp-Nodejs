const router = require('express').Router()
const Conversation = require('../models/conversation')


// create new conversation
router.post('/', async (req,res) =>{
    const newconversation = new Conversation({
        members :[req.body.senderId,req.body.recieverId]
    })
    try{
     const savedconversation = await  newconversation.save()
     res.status(200).json(savedconversation)
    }catch(err){
        res.status(500).json(err)
    }
})


// get conversation of a user

router.get('/:userId', async (req,res) =>{

   try{
    const conversation =  await Conversation.find({
        members : {$in: [req.params.userId]}
    })
    res.status(200).json(conversation)

   }catch(err){
    res.status(500).json(err)

   }
   
})
//find conversation of to users
router.get('/find/:firstuserId/:seconduserId',  async (req,res) =>{
    try{
        const conversation = await Conversation.findOne ({
            members : {$all : [req.params.firstuserId, req.params.seconduserId]},
        })
        res.status(200).json(conversation)
    }catch (err) {
        res.status(500).json(err)
    }
})
module.exports= router