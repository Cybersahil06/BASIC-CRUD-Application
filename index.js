const express = require('express')                    
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false}))
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/demoDB');

const entrySchema =  new mongoose.Schema({
    username : { type: String, required: [true,'username is Required']},
    email: {type: String, required: [true,'Email is Required'] },
    phone: {type:String, maxlength:[10,'Maximum 10 char is required']},
    listDate: {type:Date, default: Date.now},
    dept: {type:String, required: [true,'Dept is Required']},
    salary:{type:Number}

});

const Entry = mongoose.model('Entry',entrySchema);

app.get('/', (req, res) => {
    Entry.find((err,data)=>{
      if(err)                              
      console.log(err)
      else
      res.render("entrylist",{entry:data});
  
    })
  })


  app.get('/addentry', (req, res) => {                     // result starting me blank hai
    res.render("addentry",{result:''});
  })

  
app.post('/delentry', (req, res) => {
    let lid=req.body.lid;
    Entry.findByIdAndDelete(lid,(err)=>{ 
      if(!err){
        
        Entry.find((err,data)=>{
          if(!err)
          res.render("entrylist",{entry:data});
      
        })
    



      }
      //res.render("addentry",{result:''});
      console.log(err);

    })
  })


  app.post('/add', (req, res) => {                        // form fill karne ki request
    console.log(req.body);

    const listdata = new Entry({ username:req.body.username,email:req.body.email,phone:req.body.phone,dept:req.body.dept,salary:req.body.salary});
    listdata.save((err)=>{
      if(!err)
      res.render("addentry",{result:'Record Saved'});
      else
      console.log('Error in code');
    });
  })


  
app.get('/editentry/:entryid', (req, res) =>{
  let lid=req.params.entryid;                                    
  Entry.findById(lid,(err,data)=>{
    if(err)                                                         // edit karne ke liye post ko 
    console.log(err)                                             
    else
    res.render("editentry",{entry:data,result:''});
  })
});

app.post("/edit", (req,res)=>{

  let lid=req.body.lid;
  const listdata = ({username:req.body.username,email:req.body.email,phone:req.body.phone,dept:req.body.dept,salary:req.body.salary});

  Entry.findByIdAndUpdate(lid,listdata,(err)=>{
  
    if(!err)
    {
      Entry.findById(lid,(err,data)=>{
        if(!err)
        res.render("editentry",{entry:data,result:'Record Updated'});

    })
  }
    else
    console.log('Error in code');
  })
})

 app.listen(port,()=>{
     console.log(`New Site listening at http://localhost:${port}`)
 })