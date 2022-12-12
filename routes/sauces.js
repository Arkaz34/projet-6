 const express = require('express');
 const router = express.Router();
 
 const saucesController = require('../controllers/sauces');

 const auth = require('../middleware/auth');
 const multer = require('../middleware/multer');
 
 router.post('/', auth, multer, saucesController.createSauce);
 router.post('/:id/like', saucesController.likeSauce);
 router.put('/:id', auth, multer, saucesController.modifySauce);
 router.get('/', auth, saucesController.getSauce);
 router.get('/:id', auth, saucesController.getSauceById);
 router.delete('/:id', auth, saucesController.deleteSauce);

 module.exports = router;
