import express from 'express';
import connect from './db.js';
import cors from 'cors';
import auth from './auth.js';

const app = express() 
const port = 3001

app.use(cors());
app.use(express.json());

//Registracija
app.post('/user', async (req , res) =>{
    let userData = req.body;
    let id;
    try{
        id = await auth.registerUser(userData);
    }
    catch(e){
        res.status(500).json({ error: e.message });
    }

    res.json({ id:id })

});

//Dohvati sve korisnike
app.get('/users', async (req , res) =>{
    let db = await connect();
    let cursor = await db.collection('users').find({});
    let results = await cursor.toArray();
    res.json(results);
});

app.get('/secret', [auth.verify], (req,res) => {
    res.json({message: "This is a secret" + req.jwt.email})
})

//Autenticiraj ukoliko već postoji korisnik
app.post('/login', async (req, res) =>{
    let user = await req.body;
    let userEmail = user.email 
    let userPassword = user.password 
    
    try{
       let authResult = await auth.authenticateUser(userEmail, userPassword);
       res.json(authResult);
    }
    catch(e) {
        res.status(401).json({ error: e.message })
    }
})

app.listen(port, () => console.log(`Listening on port: ${port}!`))