//importation expess
const express = require('express');
//la fonction router
const router = express.Router();
//importation controllers/sauces.js
const saucesController = require('../controllers/sauces');
//importation middleware/auth.js
const auth = require('../middleware/auth');
//importation multer pour télécharger des fichiers
const multer = require('../middleware/multer');
//route creation sauces
router.post('/', auth, multer, saucesController.createSauce);
//route likeSauce
router.post('/:id/like', saucesController.likeSauce);
//route modifySauce
router.put('/:id', auth, multer, saucesController.modifySauce);
//route getSauce
router.get('/', auth, saucesController.getSauce);
//route delete sauce
router.delete('/:id', auth, saucesController.deleteSauce);
//route id sauce
router.get('/:id', auth, saucesController.getSauceById);
//exportation du module
module.exports = router;
