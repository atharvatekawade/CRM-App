const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const path=require('path');
const nodemailer=require('nodemailer');
const cookieParser = require('cookie-parser');
const LocalStrategy=require('passport-local').Strategy;
const flash = require("connect-flash");
const passport=require('passport');
const session=require('express-session');
const randomstring = require("randomstring");
const kue = require('kue-scheduler');

const pool=require('./db');
const { stat } = require('fs');
const { verify } = require('crypto');
require('dotenv').config();

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser('secret'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

app.set('view engine','ejs');
const PORT=process.env.PORT || 5000;






async function send(receiver,name,time){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: process.env.EMAIL,
               pass: process.env.PASS
        }
    });

    const html=`
        <p>Hi ${name}. This is your notification mail sent at a period of ${time}</p>
    `;

    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to: receiver, // list of receivers
        subject: 'Notification', // Subject line
        html: html
    };

    await transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else{
            console.log('Mail function called for '+name +" with time "+time);
        }
    });
}

async function verifysend(receiver,name,token){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    const html=`
        <p>Hello ${name}. This is your token:<b>${token}</b>. This token is valid for only 5 minutes</p>
    `;

    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to: receiver, // list of receivers
        subject: 'Account Verification', // Subject line
        html: html// plain text body
    };

    await transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else{
            console.log('Mail function called for '+name +" with token "+token);
        }
    });
}

async function communication(sender,receiver,body,subject){
    console.log("Communication Fn called...")
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    const mailOptions = {
        from: sender, // sender address
        to: receiver,
        subject:subject, // list of receivers
        html: body// plain text body
    };

    await transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else{
            console.log('Mail message sent...');
        }
    });
}

async function commute(sender,receiver,body,subject,password){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender,
            pass: password
        }
    });
    console.log(sender);
    //console.log(password);
    const mailOptions = {
        from: sender, // sender address
        to: receiver,
        subject:subject, // list of receivers
        html: body// plain text body
    };

    await transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          console.log('No');
          return('No');
        }
        else{
            console.log('Mail message sent...');
            return('Yes');
        }
    });
}



function initialize(passport){
    passport.use(new LocalStrategy({ usernameField:'username',passwordField:'password' },function authenticateUser(username,password,done){

        let query = pool.query(
            "SELECT * FROM users WHERE name=$1 AND verify=$2",
            [username,'Yes'],(err,result) => {
                //result.rows
                if(err) throw err;
                if (result.rows.length===0){
                    return done(null,false,{ message:'Enter valid username' })
                }
                else{
                    try{
                        if(password===result.rows[0].password){
                            return done(null,result.rows[0],{ message:'Successfully logged in' })
                            //return done(null,result[0])
                        }
                        else{
                            return done(null,false,{ message:'Password incorrect' })
                        }
                    }
                    catch(e){
                        return done(e)
                    }
                }
            }
        );


    }))

    passport.serializeUser((user,done) => done(null,user.user_id))
    passport.deserializeUser((id,done) => {
        let query = pool.query(
            "SELECT * FROM users WHERE user_id=$1 AND verify=$2",
            [id,'Yes'],(err,result) => {
                if(err) throw err;
                return done(null,result.rows[0]);
            }
        )
    })
}

initialize(passport);

function CheckLog(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    else{
        console.log('Get authenticated first')
        res.redirect('/login');
    }
}

function Admin(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.user_id===1){
            return next()
        }
        else{
            res.redirect('http://localhost:3000/')
        }
    }
    else{
        res.redirect('/login');
    }
}

function NotCheckLog(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('http://localhost:3000/');
    }
    else{
        return next()
    }
}

app.get('/user',(req,res) => {
    if(req.isAuthenticated()){
        req.user.password='It is a secret....'
        res.send(req.user);
    }
    else{
        res.send('no');
    }
})

app.get('/login',NotCheckLog,(req,res) => {
    res.render('login.ejs',{red:req.flash('red'),msg:req.flash('msg')})
})

app.post('/login',NotCheckLog,(req,res,next) => {
    passport.authenticate('local',(err,user,info) => {
        if (err) throw err;
        if(!user){
            //res.redirect('/login')
            req.flash('red',info['message'])
            res.redirect('/login')
        }
        else{
            req.logIn(user,(err) => {
                if(err) throw err;
                res.redirect('http://localhost:3000/')
                //res.redirect('/');
            })
        }
    })(req,res,next);

    
})


app.get('/register',(req,res) => {
    if(!req.isAuthenticated() || Number(req.user.user_id)===1){
        res.render('register.ejs',{red:req.flash('msg')})
    }
    else{
        res.redirect('http://localhost:3000/');
    }
})

app.delete('/logout',CheckLog,function(req,res){
    req.logOut()
    req.flash('yo','Logged out')
    res.redirect('/login')
})

app.get('/users',Admin,(req,res) => {
    pool.query(
        "SELECT * FROM users WHERE user_id>$1 AND verify=$2",
        [1,'Yes'],(err,result) => {
            if(err) throw err;
            res.send(result.rows);
        }
    );
})

app.post('/msg/:id',CheckLog,async(req,res) => {
    const id=Number(req.params.id);
    if(id===1 || id!==req.user.user_id){
        res.redirect('http://localhost:3000/')
    }
    else{
        const admin=Number(1);
        const subject=req.body.subject;
        const body=req.body.desc;
        const sender=req.body.sender;
        const password=req.body.password;
        let d = new Date();
        let n = d.getTime();
        n=n/1000;
        n=Math.floor(n);
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = dd+'-'+mm+'-'+yyyy;
        let hours = d.getHours();
        let min = d.getMinutes();
        let time=hours+":"+min;
        //let reply=await commute(sender,process.env.EMAIL,body,subject,password);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender,
                pass: password
            }
        });
        console.log(sender);
        console.log(password);
        const mailOptions = {
            from: sender, // sender address
            to: process.env.EMAIL,
            subject:subject, // list of receivers
            html: body// plain text body
        };
    
        await transporter.sendMail(mailOptions, function (err, info) {
            if(err){
              console.log('No');
              res.send('Authentication unsuccessfull')
            }
            else{
                console.log('Mail message sent...');
                pool.query(
                    "INSERT INTO messages(sender,receive,date,stamp,time,body,subject) VALUES($1,$2,$3,$4,$5,$6,$7)",
                    [id,admin,today,n,time,body,subject],(err,result) => {
                        if(err) throw err;
                        res.send("Yes");
                    }
                );
            }
        });
    }
})

app.get('/second',(req,res) => {
    let d = new Date();
    let n = d.getTime();
    n=n/100;
    n=Math.floor(n);
    n=n.toString();
    res.send(n);
})

app.get('/messages/:id',(req,res) => {
    const id=Number(req.params.id);
    //if(id===Number(req.user.user_id) || Number(req.user.user_id)===1){
    if(true){
        pool.query(
            "SELECT * FROM messages WHERE sender=$1 OR receive=$2",
            [id,id],(err,result) => {
                if(err) throw err;
                const arr=result.rows;
                arr.sort((a,b) => (a.stamp < b.stamp) ? 1 : ((b.stamp <= a.stamp) ? -1 : 0));
                res.send(arr);
            }
        );
    }
    else{
        res.redirect('http://localhost:3000/')
    }
})

app.post('/register',(req,res) => {
    if(!req.isAuthenticated() || Number(req.user.user_id)===1){
        const name=req.body.username;
        const email=req.body.email;
        const password=req.body.password;
        const time=req.body.time;
        const token=randomstring.generate();
        const d=new Date();
        let edit=d.getTime();
        let expiry=edit/1000;
        expiry=Math.floor(expiry);
        expiry=Number(expiry);
        const curr=expiry;
        expiry=expiry+300;
        expiry=Number(expiry);
        edit=edit.toString();
        pool.query(
            "DELETE FROM users WHERE verify=$1 AND expiry<$2",
            ['Not',curr],(err,result) => {
                if(err) throw err;
                pool.query(
                    "SELECT * FROM users WHERE (name=$1 OR email=$2) AND verify=$3",
                    [name,email,'Yes'],(err,result) => {
                        if(err) throw err;
                        if(result.rows.length>0){
                            req.flash('msg','Username and Email should be unique...')
                            res.redirect('/register');
                        }
                        else{
                            pool.query(
                                "INSERT INTO users(name,email,password,time,token,edit,expiry) VALUES($1,$2,$3,$4,$5,$6,$7)",
                                [name,email,password,time,token,edit,expiry],async (err,result) => {
                                    if(err) throw err;
                                    await verifysend(email,name,token);
                                    res.redirect('/verify/'+name);
                                }
                            );
                        }
                    }
                );

            }
        );
    }
    else{
        res.redirect('http://localhost:3000/')
    }

})

app.post('/message/:id',Admin,async(req,res) => {
    const id=Number(req.params.id);
    const admin=Number(1);
    const body=req.body.desc;
    const subject=req.body.subject;
    const receiver=req.body.receiver;
    let d = new Date();
    let n = d.getTime();
    n=n/1000;
    n=Math.floor(n);
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = dd+'-'+mm+'-'+yyyy;
    let hours = d.getHours();
    let min = d.getMinutes();
    if(Number(min)<10){
        min='0'+min;
    }
    let time=hours+":"+min;
    await communication(process.env.EMAIL,receiver,body,subject);
    pool.query(
        "INSERT INTO messages(sender,receive,date,stamp,time,body,subject) VALUES($1,$2,$3,$4,$5,$6,$7)",
        [admin,id,today,n,time,body,subject],(err,result) => {
            if(err) throw err;
            res.send("Updated...");
        }
    );
})

app.delete('/user/:id',Admin,(req,res) => {
    const id=Number(req.params.id);
    console.log('You hit the delete route '+id.toString());
    pool.query(
        "SELECT * FROM users WHERE user_id=$1",
        [id],(err,result) => {
            if(err) throw err;
            let old=result.rows[0].edit;
            let Queue = kue.createQueue();
            Queue.remove({
                unique:old
            }, function(error, response) {
                if(error) throw error;
                console.log('Stopped');
            });
            pool.query(
                "DELETE FROM users WHERE user_id=$1",
                [id],(err,result) => {
                    if(err) throw err;
                    res.redirect('http://localhost:3000/');
                }
            );
        }
    );
})

app.get('/edit/:id',Admin,(req,res) => {
    const id=Number(req.params.id);
    pool.query(
        "SELECT * FROM users WHERE user_id=$1",
        [id],(err,result) => {
            if(err) throw err;
            res.render('edit.ejs',{user:result.rows[0],red:req.flash('msg')});
        }
    );
})

app.post('/edit/:id',Admin,(req,res) => {
    const id=Number(req.params.id);
    const name=req.body.username;
    let time=req.body.time;
    pool.query(
        "SELECT * FROM users WHERE name=$1",
        [name],(err,result) => {
            if(err) throw err;
            if(result.rows.length>1){
                req.flash('msg','Username is already taken...')
                res.redirect('/edit/'+id.toString());
            }
            else if(result.rows.length===1 && result.rows[0].user_id!==id){
                req.flash('msg','Username is already taken...')
                res.redirect('/edit/'+id.toString());
            }
            else{
                pool.query(
                    "SELECT * FROM users WHERE user_id=$1",
                    [id],(err,result) => {
                        if(err) throw err;
                        let old=result.rows[0].edit;
                        const mail=result.rows[0].email;
                        let Queue = kue.createQueue();
                        Queue.remove({
                            unique:old
                        }, function(error, response) {
                            if(error) throw error;
                            console.log('Stopped');
                        });
                        const d=new Date();
                        const edit=d.getTime();
                        let Queuee=kue.createQueue();
                        let job=Queuee
                            .createJob(edit)
                            .attempts(3)
                            .priority('normal')
                            .unique(edit);
                        //time=Number(time);
                        //time=time*86400;
                        //time=time.toString();
                        Queuee.every(time+' seconds', job);
                        Queuee.process(edit, async function(job, done) {
                            await send(mail,name,time);
                            done();
                        });
                        pool.query(
                            "UPDATE users SET name=$1,time=$2,edit=$3 WHERE user_id=$4",
                            [name,time,edit,id],(err,result) => {
                                if(err) throw err;
                                res.redirect("http://localhost:3000/");
                            }
                        );    
                    }
                );
            }
        }
    );
})

app.get('/verify/:name',(req,res) => {
    if(!req.isAuthenticated() || Number(req.user.user_id)===1){
        const name=req.params.name;
        res.render('verify.ejs',{name:name})
    }
    else{
        res.redirect('http://localhost:3000/');
    }
})
app.post('/verify/:name',(req,res) => {
    if(!req.isAuthenticated() || Number(req.user.user_id)===1){
        const name=req.params.name;
        let token=req.body.token;
        token=token.trim()
        const d=new Date();
        let edit=d.getTime();
        let expiry=edit/1000;
        expiry=Math.floor(expiry);
        expiry=Number(expiry);
        pool.query(
            "SELECT * FROM users WHERE name=$1 AND verify=$2",
            [name,'Not'],(err,result) => {
                if(err) throw err;
                if(result.rows.length===0){
                    res.redirect('http://localhost:3000/')
                }
                else{
                    if(expiry<=result.rows[0].expiry && token===result.rows[0].token){
                        let edit=result.rows[0].edit;
                        let time=result.rows[0].time;
                        let Queue = kue.createQueue();
                        let email=result.rows[0].email;
                        //create a job instance
                        let job = Queue
                                    .createJob(edit)
                                    .attempts(3)
                                    .priority('normal')
                                    .unique(edit);

                        //schedule it to run every 2 seconds
                        //time=Number(time);
                        //time=time*86400;
                        //time=time.toString();
                        Queue.every(time+' seconds', job);


                        //somewhere process your scheduled jobs
                        Queue.process(edit, async function(job, done) {
                            await send(email,edit,time);
                            done();
                        });
                        pool.query(
                            "UPDATE users SET verify=$1 WHERE name=$2",
                            ['Yes',name],(err,result) => {
                                if(err) throw err;
                                //req.flash('msg','Successfully registered...')
                                res.redirect('/login');
                            }
                        );
                    }
                    else{
                        req.flash('msg','Registeration Failed, Try Again...')
                        res.redirect('/register');
                    }
                }
            }
        );
    }
    else{
        res.redirect('http://localhost:3000/');
    }
})

app.listen(PORT,() => {
    console.log(`Server has started on port ${PORT}!!`)
})
