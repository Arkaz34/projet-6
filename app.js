//importation du fichier .env, variable d'environnement
require('dotenv').config();
/*importer express (une application Express est fondamentalement une série de fonctions 
appelées middleware.) Chaque élément de middleware reçoit les objets request et response*/
const express = require('express');
/*Le module Mongoose fournit plusieurs fonctions afin de manipuler 
les documents de la collection de la base de données MongoDB*/
//importation connexion base de donnée MongoDb
const mongoose = require('mongoose');
//importation node.js utilitaires pour travailler avec les chemins de fichiers et de répertoires
const path = require('path');
//importation routes/sauces.js
const ModelsSauceRoutes = require('./routes/sauces');
//importation des routes 
const userRoutes = require('./routes/user');
//pour créer une application express
const app = express();
//importation de mongoose pour me connecter à mongoDb
//${process.env.DB_USERNAME} récupére la variable pour connexion sans voir mon id et mot de passe
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@projet5.anocc4y.mongodb.net/?retryWrites=true&w=majority`,
    {useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
//app.use() route général et la fonction (middleware)
//gérer les problèmes de CORS (permet d'utiliser 2 server différent)
app.use((req, res, next) => {
    //Autorise l'accès à l'API pour n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Définit les Headers utilisé par l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Définit les méthodes possible à utiliser
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//transformer le corps ( body ) ne json objet javascript utilisable
app.use(express.json()); 
//route d'authentification 
app.use('/api/auth', userRoutes);
//pour accéder aux images du dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));
//route routes/sauces.js
app.use('/api/sauces', ModelsSauceRoutes);
//expression de app.js pour pouvoir y accéder depuis un autre fichier
module.exports = app;