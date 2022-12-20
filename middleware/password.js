//importation de password-validator
const passwordValidator = require('password-validator');
//création du schema
const passwordSchema = new passwordValidator();
// schema que doit respecter le mot de passe
passwordSchema
    .is().min(5)// Longueur minimale 5 
    .is().max(100)// Longueur maximale 100 
    .has().uppercase()// Doit contenir des lettres majuscules 
    .has().lowercase()// Doit contenir des lettres minuscules 
    .has().digits(1)// Doit avoir au moins 1 chiffres 
    .has().not().spaces()// Ne doit pas avoir d'espaces 
    .is().not().oneOf(['Passw0rd', 'Password123']);// Liste noire ces valeurs
    console.log(passwordSchema.validate('validPASS123'));
    //Vérification de la qualité du password par rapport au schéma
module.exports = (req, res, next) =>{
    //si le mot de passe est bon next()
    if (passwordSchema.validate(req.body.password)){
        next();
    }else{
        /*sinon mot de passe non valide (erreur 401 requête non effectuée) 
        car il manque des informations d'identification)*/
        return res.status(400).json({ message : "Le mot de passe doit contenir entre 5 et 100 caractères avec au moins : 1 majuscule + 1 minuscule + 1 chiffre + 1 symbole" });
    }
};
//Le mot de passe doit contenir entre 5 et 100 caractères avec au moins : 1 majuscule + 1 minuscule + 1 chiffre + 1 symbole