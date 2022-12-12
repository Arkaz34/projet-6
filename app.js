//console.log(process.env);
require('dotenv').config();
/*importer express (une application Express est fondamentalement une série de fonctions appelées middleware.)
Chaque élément de middleware reçoit les objets request et response*/
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const ModelsSauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();
//importation de mongoose pour me connecter à mongoDb
mongoose.connect(`mongodb+srv://arnaud:Louane17.@projet5.anocc4y.mongodb.net/?retryWrites=true&w=majority`,
    {useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json()); //body-parser présent dans express. Permet de lire le contenu JSON renvoyé par les requêtes POST

app.use('/images', express.static(path.join(__dirname, 'images'))); 
app.use('/api/sauces', ModelsSauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;