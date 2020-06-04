const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var db = require('./module/query'); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.get('/',(req,res) => {
    res.render('index');
});
app.post('/signup', (req,res) => {
    console.log(req.body);
    data = {
        name : req.body.name,
        username : req.body.username,
        email : req.body.email,
        contact : req.body.contact,
        password : req.body.password
    };
    db.query('INSERT INTO user SET ?',data,(err,res)=>{
        if(err) throw err;
        console.log(res);
        
    });   
    res.send("Successful Sign up");
}); 
app.post('/login',(req,res) => {
     
    let sql= 'SELECT * FROM user WHERE username = ?';
    //console.log(data);
    db.query(sql,req.body.username,(err,resu) => {
        if(err) throw err; 
        
        console.log(resu); 
        if(resu.length<1)
        res.send("Invalid username or password");
        else if(resu[0].password == req.body.password) 
        res.send("Successful Login"); 
        else res.send("Invalid username or password");
    });   
    
});
function genotp() {  
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
} 
  var otp;
app.get('/otp',(req,res) => {
   
   res.render('otp');
});
var user ; 
var sendsms = require('./module/sendsms');
app.post('/otp',(req,res) => {
    otp = genotp();
    post = {
        otp : otp 
    }; 
    user = req.body.username; 
    db.query('SELECT * FROM user WHERE username =?',user, (err,resu) => {
        if(err) throw err;
        var body = "Your OTP is : "+otp;
        var to = "+91"+resu[0].contact;  
            sendsms(body,to); 
    }); 
    console.log(otp);
        db.query('UPDATE user SET ? WHERE username=?',[post,user],(err,resu) => {
        if(err) throw err; 
          
        console.log(resu);
    }); 
    res.render('enterotp');
}); 

app.post('/verify',(req,res) => {
    db.query('SELECT * FROM user WHERE username =?',user, (err,resu) => {
        if(err) throw err;
        if(resu[0].otp == req.body.otp) 
        {   
            res.render('reset');
        }
        else 
        {
            res.redirect('/otp');
        }
    });
}); 
app.post('/reset',(req,res) => {
    post = {password : req.body.password };
    sql = 'UPDATE user SET ? WHERE username = ?';
    db.query(sql,[post,user], (err,resu) => {
        res.send("Password reset");
    });
});
app.listen(3000,() => {
    console.log("Listening on port 3000");
});