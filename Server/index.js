let express= require('express')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let User=require('./User')
let mongoose= require('mongoose')
let Upload =require('./Upload')
mongoose.connect('mongodb://127.0.0.1:27017/insta').then(()=>{
    console.log("db.....");
    
})
let cors= require('cors')

let app=  express()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("hello")

})



app.post("/signUp", async (req, res) => {
    try {
      const { name, email, passWord } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(passWord, 10);
      const newUser = new User({ name, email, passWord: hashedPassword });
      await newUser.save();
  
      res.json({ msg: "Signup successful", user: newUser });
    } catch (err) {
     return  res.status(500).json({ msg: "Error during signup", error: err.message });
    }
  });


  app.post("/login", async (req, res) => {
    try {
      const { email, passWord } = req.body;
      const user = await User.findOne({ email });
      console.log(user ,"user");
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      console.log("Plain Password:", passWord);
  console.log("Hashed from DB:", user.passWord);
  
      const isMatch = await bcrypt.compare(passWord, user.passWord);
      if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
  
     const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role || "user" },
    "SECRET123",
    { expiresIn: "1h" }
  );
  
  
  res.json({
    msg: "Login successful",
    token,
    user: { _id: user._id, name: user.name, email: user.email }
  });
    } catch (err) {
     return res.status(500).json({ msg: "Error during login", error: err.message });
    }

})



// middleware/auth.js


let auth = function(req, res, next) {
    const token = req.headers.authorization;
    console.log("header",req.headers)
    // console.log("hello",token);
    if (!token) return res.status(401).json({ message: "Login first!" });

    try {
        const decoded = jwt.verify(token, "SECRET123");
        console.log(decoded,"kyaya ");
        
        req.user = decoded;   // IMPORTANT: req.user yahi se aata hai
        console.log("decoded",decoded);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
app.post('/upload', auth, async(req,res)=>{
  const userId = req.user._id;  
  const { imgUrl } = req.body;
  if(!imgUrl){
      return res.send("URL not found")
  }
  let uploadD = new Upload({
      imgUrl,
      user: userId,      
      likedBy: []
  })
  await uploadD.save();
  return res.send("uploaded");
})


app.post("/like/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Upload.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

   
    post.likedBy = post.likedBy.filter(id => id !== null);


    const alreadyLiked = post.likedBy.some(
      id => id.toString() === userId.toString()
    );

    // --------------------------------
    // 🔴 UNLIKE (agar like kiya hua hai)
    // --------------------------------
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likeCount = Math.max(0, post.likeCount - 1);

      await post.save();
      return res.json({
        success: true,
        message: "Disliked",
        likeCount: post.likeCount
      });
    }

    // --------------------------------
    // 🟢 LIKE (agar pehle like nahi kiya)
    // --------------------------------
    post.likedBy.push(userId);
    post.likeCount += 1;

    await post.save();
    return res.json({
      success: true,
      message: "Liked",
      likeCount: post.likeCount
    });



  } catch (err) {
    console.log("LIKE API ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.post("/follow/:id",auth,async(req,res)=>{
  let targetUserId=req.params.id;
  let currentUserId=req.user._id
  console.log(req.user,"hehh");
  
  if(targetUserId==currentUserId){
    res.json({msg:"nashe kam kro thoda..."})
  }
    let targetUser=   await User.findById(targetUserId)
   let currentUser=   await User.findById(currentUserId)
   if(!currentUser || !targetUser){
    res.send("user not found")
   }

   let alreadyFollow=currentUser.following.includes(targetUserId)
   console.log(alreadyFollow,"helloo");
   
   if (alreadyFollow) {
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId.toString()
    );

    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    return res.json({
      success: true,
      msg: "Unfollowed successfully"
    });
  }



    //  followers
    currentUser.following.push(targetUserId)
    targetUser.followers.push(currentUserId)
    await currentUser.save()
    await targetUser.save()
    res.json({msg:"followed succe......"})








})







app.listen(4000,()=>{
    console.log("server running on port no 4000");
    
})


// //Model   comment.js
     
// let mongoose=  require('mongoose')

// let commenrtSchema=  new mongoose.Schema({
//   comment:{
//     type:String,
//   },
//   user:{
//     type:mongoose.Schema.ObjectId,
//     ref:"User"
//   },
//   post:{
//      type:mongoose.Schema.ObjectId,
//     ref:"Upload"

//   }

// })
   
//  let Comment=  mongoose.model("Comment",commenrtSchema)
//  module.exports=Comment


//   //api 

//   app.post('/comment/:postId',  async(req,res)=>{
//     let {postId}=req.params;
//              let userID=     req.user._id
//           let {text} =   req.body
//           if(!text){
//             res.send("textttt")

//           }
  
//           let commentData=  new Comment({
//             text,
//             post:postId,
//             user:userID
            
//           })
         
//        await commentData.save()
//        return res.json({
//         msg:"Comment added...",
        
//        })


                

//   })






