 //importation de mongoose
 const mongoose = require('mongoose');
 //importation de mongoose-unique-validator
 const uniqueValidator = require('mongoose-unique-validator');
//le modèle de base de donnée pour le signup (pour enregistrer un nouvel utilisateur)
 const userSchema = mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true }
 });
//sécurité conseillé pour ne pas enregistrer deux fois la même adresse mail dans MongoDb
 userSchema.plugin(uniqueValidator);
//exportation du module
 module.exports = mongoose.model('User', userSchema);