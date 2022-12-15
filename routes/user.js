//importer express pour utiliser la fonction routeur d'express
const express = require('express');
/*Le Router aide à créer une liste de toutes les routes d'applications et à les associer 
à un fichier de contrôleur contenant le code d'implémentation*/
//importation du middleware/password.js
const password = require('../middleware/password');
//la fonction Router()
const router = express.Router();
//importation du controllers/user.js
const userCtrl = require('../controllers/user');
//route (endpoint) signup pour créer une fiche user
router.post('/signup',password, userCtrl.signup);
//route (endpoint) login  
router.post('/login', userCtrl.login);
//exportation du module
module.exports = router;