var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(express.static('public'))//Public is the folder which has all the html,css&js files as a static resourse
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/regdb');//regdb is the DB
var db = mongoose.connection;//through this 'var db' we can comm. with Database

db.on('error', function () {
    console.log('Connection Failed!!');
});

db.on('open', function () {
    console.log('Connection is established!!');
});

var jobSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is Required!"]
    },
   
    location: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: true
    },
    usertype: {
        type:String,
        required:true
    },
    activeUser: {
        type:Boolean,
        default:false,
        required:true
    },
    applied:[String]


});

var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true
    },
   
    keywords: {
        type: String,
        required: true

    },
    location: {
        type: String,
        required: true
    },
    
    activeUser: {
        type:String,
        
    }

});

var role = mongoose.model('jobColl',jobSchema);
var jobp = mongoose.model('postColl',postSchema);

app.post('/reg1',function(req,res){
    var push = new role(req.body);
    push.save();
})

app.post('/login1',function(req,res){
    // console.log(req.body);
    role.findOne({username:req.body.username},function(error,docs){
        if(!docs)
        {
            res.json({
                flag:'failed',
                
            })
        }else
        {
            if(docs.password==req.body.password)
            {
                role.findOneAndUpdate({username:req.body.username},{$set:{'activeUser':true}},function(error,data){
                    if(!error){
                        res.json({
                            flag:'success',
                            data:data
                        })
                    }
                }) 
                
            }else{
                res.json({
                    flag:'failed',
                    
                })
            }
            
        }
    })
})

app.post('/post1',function(req,res){
    var push = new jobp(req.body);
    push.save();
})
app.post('/search1',function (req,res){
    jobp.find({$or:[{title:req.body.title},{location:req.body.location},{keywords:req.body.keywords}]},function(error,docs)
    {
        console.log(docs);
        if(!docs)
        {
            res.json({
                flag:'failed',
                
            })
        }
        else
        {
            res.json({
                flag:'success',
                data:docs
                
            })
        }
    })
})

app.post('/applied1/:un',function(req,res){
    // console.log(req.params.un);
    // console.log(req.body.jobid);
    

    role.findOne({
        username:req.params.un
    }).then((user)=>{
        console.log(user.applied.indexOf(req.body.jobid));
        if(user.applied.indexOf(req.body.jobid))
        {
            console.log("here");
        user.applied.push(req.body.jobid);
        }
        else
        {
            console.log("here2");
            user.applied.pop(req.body.jobid);
        }
            user.save().then(user=>{
                console.log(user);
                res.send(user);
       
        });
    })

    
})

app.post('/getAppliedJobs/:un',function(req,res){
    console.log("req received")
    role.findOne({username:req.params.un}).then((user)=>{
        console.log(user);
        jobp.find({
            _id:{
                $in:user.applied
            }
        }).then((jobs)=>{
            res.send(jobs);
        //  console.log(jobs);
        })
    })
})

app.post('/logout1',function(req,res){
    console.log("logout recieved")
    
    role.findOneAndUpdate({username:req.body.username},{$set:{'activeUser':false}},function(error,data)
    {   
        if(!error){
            res.json({
                flag:'success',
                data:data
            })
        }
         else
         {
                res.json({
                    flag:'failed',
                    
                })
            }
        

    })

})
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
})



app.listen(8000, function () {
    console.log('Middleware/Express/Node/Backend is running on localhost:8000');
});