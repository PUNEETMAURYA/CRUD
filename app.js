const express=require('express'),
      app=express(),
      port = 5000||process.env.PORT,
      
      ejs=require('ejs'),
      mongoose=require('mongoose');
//API will be done via POSTMAN, so no ejs neede at all:)

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');      
mongoose.connect('mongodb://localhost:27017/Student',{useNewUrlParser:true,useUnifiedTopology:true});
const userSchema = new mongoose.Schema({
    Name:{type:String,required:true},
    Roll:Number,
    Age:Number,
    State:String
});
const Student = mongoose.model('details',userSchema);


app.route('/')
    .get(function(req,res){
        Student.find({},function(err,Found){
            if(err) res.send(err);
            else {
                res.locals.Found=Found;
                res.render('home');
                // res.send(Found);    //testing via postman,no ejs needed
               
            }
        });
    })
    .post(function(req,res){
        if(req.body.hasOwnProperty("insert")){
            res.redirect('/insert')
        }
    })
    .put(function(req,res){
        Student.updateOne(
            { _id:req.body._id},
            {$set:{Name:req.body.name,Roll:req.body.roll,Age:req.body.age,State:req.body.state}},
            {overwrite:true},
            function(err){
                if(err) res.send('Error');
                else res.send('Updated Successfully')
            })
            
    })
    .patch(function(req,res){
        Student.updateOne(
            { _id:req.body._id},
            {$set:{Roll:req.body.roll}},  //Afte finding person via name,specify columns to be updated
            {overwrite:false},   //keep remaining columns as as they are
            function(err){
                if(err) res.send('Error');
                else res.send('Updated Successfully')
            })
            
    })
    .delete(function(req,res){
        Student.findOneAndDelete({
            _id:req.body._id
        })
        .then(res.send('Deleted successfully!'))
        .catch('Error');
    });

app.get('/insert',(req,res)=>{
    res.render('insert',{pagetitle:"Insert"});
});

app.post('/insert',(req,res)=>{
    const newStudent = new Student({
        Name:req.body.name,
        Roll:req.body.roll,
        Age:req.body.age,
        State:req.body.state
    });
    newStudent.save()
    res.redirect('/');
})

app.get('/update/:id',(req,res)=>{
    // console.log(req.params.id);
    Student.findById({_id:req.params.id},(err,result)=>{
        if(err) console.log(err);
        else{
            res.locals.mystudent=result;
            res.render('update',{pagetitle:"Update"});
        }
    }
)
});

app.post('/update/:id',(req,res)=>{
    Student.findByIdAndUpdate(
        { _id:req.params.id},
        {$set:{Name:req.body.name,Roll:req.body.roll,Age:req.body.age,State:req.body.state}},
        {overwrite:true},
        function(err){
            if(err) res.send(err);
            else res.redirect('/');
        })
    // console.log(req.params.id);
});

app.get('/delete/:id',(req,res)=>{
    Student.findByIdAndDelete({_id:req.params.id},(err)=>{
        if(err) res.send('Some error Occured');
        else res.redirect('/'); 
    });
    
})

app.listen(port,console.log(`Listening to ${port}`));
