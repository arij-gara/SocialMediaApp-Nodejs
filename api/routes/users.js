const router = require('express').Router()
const User = require('../models/user')
//update user
router.put('/:id', async(req,res)=>{
    if (req.body.userId === req.params.id || req.body.isadmin){
        if(req.body.password){
            try{
           const salt = await bcrypt.genSalt(10)
           req.body.password = await bcrypt.hash(req.body.password,salt)
            }catch(err){
       return res.status(500).json(err)
            }

        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body})
            res.status(200).json('account has been updated')
        }catch(err){
            console.log(err)
        }
    }
})
//delete user 
router.delete('/:id', async(req,res) =>{
    if( req.body.userId === req.params.id  || req.body.isadmin) {
     try{
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json(' accoount has been deleted')
     }catch(err){
       return res.status(500).json(err)
     }
    } else{
        return  res.status(403).json(" you can delete only your account ")
    }
   
})
// get a user 
// router.get('/:id', async(req,res)=>{

//     try{
//       const user = await User.findById(req.params.id)
//       const {password,updatedAt, ...others}= user._doc
//       res.status(200).json(others)
//     }catch(err){
//     res.status(500).json('user not found')
//     }
// })
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user 
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { following: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });
//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { following: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });
 // get friends 
 router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilepic } = friend;
      friendList.push({ _id, username, profilepic });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports= router