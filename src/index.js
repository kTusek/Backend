import express from 'express';
import connect from './db.js';
import cors from 'cors';
import mongo from 'mongodb';
import auth from './auth.js';

const app = express() 
const port = 3000

app.use(cors());
app.use(express.json());

//Registracija
app.post('/user', async (req , res) =>{
    let user = req.body;

    try{
        auth.registerUser(user);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }

    res.json({
        status: "Success"
    })

});

//Dohvati sve korisnike
app.get('/users', async (req , res) =>{
    let db = await connect();
    let cursor = await db.collection('users').find({});
    let results = await cursor.toArray();
    res.json(results);
});

app.get('/secret',  [auth.verify], (req,res) => {
    res.json({message: "This is a secret" + req.jwt.email})
})

app.listen(port, () => console.log(`Listening on port: ${port}!`))