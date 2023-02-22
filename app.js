const express = require('express');
const morgan = require('morgan');
const morgon = require('morgan');
const mongoose= require('mongoose');
const { result } = require('lodash');
const Blog=require('./models/Blogs');
const { urlencoded } = require('express');
const bodyParser = require("body-parser"); 

// express app
const app = express();
//connecting to DB
const mdburl='mongodb+srv://Abhidemo03:9696858107@cluster0.jf2t9qo.mongodb.net/NodeJs?retryWrites=true&w=majority';
mongoose.connect(mdburl,{useNewUrlParser: true,useUnifiedTopology:true})
.then((result)=>app.listen(3000))
.catch((err)=>console.log(err));


// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');

//use of morgon midware
app.use(morgan('dev'))

//how to make any file public by passing folder name 
app.use(express.static('htmls'));

//to access url of the other pages using midware
app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) => {
 
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
  //{ title: 'About' } giving title an extra title html/ejs
});

//blog main
app.get('/blogs',(req,res)=>{
  Blog.find().sort({createdAt:-1})
  .then((result)=>{
       res.render('index',{title:'All blogs',blogs:result})
  })
  .catch((err)=>{console.log(err);})
})


//handling post req
app.post('/blogs',(req,res)=>{
  const blog= new Blog(req.body)

  //saving it
  blog.save()
  .then((result)=>{
    res.redirect('/blogs');

  })
  .catch((err)=>{
    console.log(err)
  })
});

//establlishing a link by data id 
app.get('/blog/:id',(req,res)=>{
  const id=req.params.id;
  Blog.findById(id)
  .then((result)=>{
    res.render('details',{blogx:result, title:'Blog Details'});

  })
  .catch((err)=>{console.log(err)})
});
app.delete('/blog/:id',(req,res)=>{
  const id=req.params.id;
  Blog.findById(id)
  .then((result)=>{
    res.json({redirect:'/blogs'});

  })
  .catch((err)=>{console.log(err)})
});





app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page an eg of midware fire for every req
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});