const User = require('../models/user')
const md5 = require('md5')
const uuid = require('uuid')
const jwt = require('jsonwebtoken') //token 认证
const config = require('../config')
const bcrypt = require('bcryptjs')
const axios = require('axios');
const QQmailer = require("nodemailer");
const Course = require('../models/course')
const CourseList = require('../models/courselist')
const salt = bcrypt.genSaltSync(config.salt)

// const salt = bcrypt.genSaltSync(config.saltRounds)
var mailTransporter = QQmailer.createTransport({
  host: "smtp.qq.com",
    port: 465,
    
    auth: {
      user: "yangyu_vpn@foxmail.com", // generated ethereal user
      pass: config.email_pass, // generated ethereal password
    },
});

const GenerateToken = user => {
  return jwt.sign({
    _id: user._id,
    username:user.username,
    role:user.role,
    state:user.state
  }, config.JWT_SECRET, {
    jwtid: uuid.v4(),
    expiresIn: config.JWT_EXPIRY,
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
    algorithm: config.JWT_ALG
  })
}

const ReturnUserInfo = user => {
  return {
    _id: user._id,
    username:user.username,
    role:user.role,
    state:user.state
  }
}

const login = async function (req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const from = req.body.from;
    
    const userInfo = await User.findOne({ email: email ,from:from});

    if (userInfo) {
      const verify = bcrypt.compareSync(password,userInfo.password);
      if (verify) {
        if(userInfo.state=="deactive"){
          return res.send({ success: true, code: 0, message: 'The account is deactive,Please contack the administrator or check your email!' })

        }
        // 生成token
        const token = GenerateToken(userInfo);
        // res.cookie('authorization', token, {
        //   httpOnly: true,
          
        //   maxAge:3600*1000
        // })
        // 存储token到redis
        return res.send({ success: true, code: 1, token: token, user: ReturnUserInfo(userInfo) })
      } else {
        return res.send({ success: true, code: 0, message: 'Wrong password' })
      }
    } else {
      return res.send({ success: true, code: 0, message: 'The account is not known!' })
    }
  } catch (error) {
    return res.send({ success: true, code: 0, message: 'error:' + error })
  }
}

const loginByGithub = async function(req,res,next){
  let path = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id
  return res.send({path:path});
}

const GithubCallback = async function(req,res,next){
  let code = req.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code
  }
  
  let resp = await axios.post('https://github.com/login/oauth/access_token', params)
  
  const access_token = resp.data.split("&")[0].split("=")[1]
  

  // let url = 'https://api.github.com/user?access_token=' + access_token;
  resp = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  });
  let username = resp.data.login;
  //登录
  let user = await User.findOne({username:username,from:"github"});
  if(user){
    var token =  GenerateToken(user);
    return res.redirect('http://localhost:4200/?username='+username+"&token="+token);
    // return res.send({ success: true, code: 1, token: token, user: ReturnUserInfo(userInfo) })
  }
  else{
    var new_user = await new User({username:username,from:"github",state:"active"}).save();
    var token =  GenerateToken(new_user);
    return res.redirect('http://localhost:4200/?username='+username+"&token="+token);
  }
  
}


const validateToken = async function (req, res, next) {

  if(!req.userInfo)
    return res.send({ success: true, code: 0, message: 'The account is deactive' })
  else
    return res.send({ success: true, code: 1, user: ReturnUserInfo(req.userInfo) })
}



const register = async function (req, res, next) {
  
    try {
      const username = req.body.username;
      const password = req.body.password;
      const role = req.body.role;
      const from = req.body.from;
      const email = req.body.email;
      const checkUsername = await User.findOne({ email: email ,from:from})
      if (checkUsername) {
        return res.send({ success: true, code: 0, message: 'The e-mail is already used!!!' })
      } else {
       
        const newUserInfo = new User({
          username: username,
          password: bcrypt.hashSync(password,salt),
          role: role,
          email:email,
          state:"deactive",
          from:from        
        });
        newUserInfo.save().then( (result)=> {
          let token = jwt.sign({username:username},config.JWT_SECRET,{expiresIn:config.JWT_EXPIRY});
           mailTransporter.sendMail({
            from:"1034275785@qq.com",
            to:email,
            subject:"Activate your account",
            html:`<b>Please click <a href=http://127.0.0.1:3000/activate_account/?token=${token}>here</a>  to activate your account</b> `
          },(err,info)=>{
            
            return res.send({ success: true, code: 1, user: ReturnUserInfo(result) });

          })
        }).catch(error => {
          
          return res.send({ success: true, code: 0, message: 'fail！error:' + error });
        })
      }
    } catch (error) {
      return res.send({ success: true, code: 0, message: 'fail！error:' + error })
    }
  
}

const get_courses = async  function(req,res,next){
  var course_list = await Course.find({});
  return res.send({course_list:course_list});

}

const get_courseList = async function(req,res,next){
  var courseLists = null;
  if(req.userInfo){
    courseLists = await CourseList.find();
  }
  else{
    courseLists = await CourseList.find({visibility:'public'}).sort({updatedAt:-1}).limit(10);
  }
  
  

  for(let index in courseLists){
    var course_list = await Course.find({_id:{$in:courseLists[index].course_IDs}});
    courseLists[index] = courseLists[index].toObject();
    courseLists[index]['course_list'] = course_list;
    if(req.userInfo && courseLists[index].creator.id==req.userInfo._id.toString())
      courseLists[index].self = true;
  }
  
  return res.send({courseLists:courseLists});
}

const activate_account = async function(req,res,next){
  var token = req.query["token"];
  var user = jwt.verify(token,config.secret);
  var activate_user = await User.findOne({username:user.username,from:"web"});
  if(activate_user.state=="active"){
    return res.send("The account is already active");
  }
  else{
    await activate_user.update({state:"active"});
    return res.send("Account has activated!!!");
  }
}

const course_list_name_duplicated = async function(req,res,next){
  var name = req.query.name;
  var courseList_id = req.query.courseList_id
  var result = null;
  if(courseList_id){
    result = await CourseList.find({name:name,_id:{$ne:courseList_id}})
  }
  else{

    result = await CourseList.find({name:name})

  }
  if(result.length>0){
    return res.send({duplicated:true});
  }
  else{
    return res.send({duplicated:false})
  }


}

const edit_course_list = async function(req,res,next){
  var edit_courseList_id = req.body.id;

  CourseList.findByIdAndUpdate(edit_courseList_id,req.body,(err,doc)=>{
    if(err){
      
      return res.send({"code":1,"message":err.toString()});
    }
    else{
      
      return res.send({"code":0});
    }
  })
}
const add_course_list = async function(req,res,next){
  try {
    new CourseList(req.body).save((err,doc)=>{
      if(err){
       
        return res.send({"code":1,"message":err.toString()});
      }
      else{
        
        return res.send({"code":0});
      }
    });
  } catch (err) {
    
        return res.send({"code":1,"message":err.toString()});
  }
}

const delete_courseList = function(req,res,next){
  try {
    if(!req.userInfo){
      return res.send({"code":1,"message":"Access Deny"});
    }
    var courseList_id = req.query.courseList_id;
    CourseList.findByIdAndRemove(courseList_id,(err,doc)=>{
      if(err){
        
        return res.send({"code":1,"message":err.toString()});
      }
      else{
        
        return res.send({"code":0});
      }
    })
    
  } catch (err) {
      
      return res.send({"code":1,"message":err.toString()});
  }
}

const add_review = async function(req,res,next){
  var content = req.body["review"];
  var course_id = req.body["course_id"];
  Course.findByIdAndUpdate(course_id,
    {$push:{reviews:{"user":{id:req.userInfo._id,name:req.userInfo.username},"hidden":"no","content":content}}},
    (err,doc)=>{
      if(err){
        
        return res.send({"code":1,"message":err.toString()});
      }
      else{
        
        return res.send({"code":0});
      }
    }
    );
}

const hide_review = async function(req,res,next){
  var review_id = req.query["review_id"];
  var course_id = req.query["course_id"];
  var state = req.query["state"];
  var reviews = (await Course.findById(course_id)).reviews;
  for(let review of reviews){
    if(review._id==review_id){
      review.hidden = state;
      break;
    }
  }
  Course.findByIdAndUpdate(course_id,{reviews:reviews},(err,doc)=>{
    if(err){
      
      return res.send({"code":1,"message":err.toString()});
    }
    else{
      
      return res.send({"code":0});
    }
  })

}

const change_user_state = async function(req,res,next){
  var user_id = req.query["user_id"];
  var state = req.query["state"];
  var role = req.query["role"];
  User.findByIdAndUpdate(user_id,{state:state,role:role},(err,doc)=>{
    if(err){
      
      return res.send({"code":1,"message":err.toString()});
    }
    else{
      
      return res.send({"code":0});
    }
  })
}




module.exports = {
  login,
  loginByGithub,
  GithubCallback,
  validateToken,
  register,
  activate_account,
  get_courseList,
  get_courses,
  course_list_name_duplicated,
  edit_course_list,
  add_course_list,
  delete_courseList,
  add_review,
  hide_review,
  change_user_state,
  get_users
}

