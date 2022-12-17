//importation de bcrypt pour hasher le mot de passe
const bcrypt = require('bcrypt');
//importation de crypto-js pour chiffrer l'email
const cryptojs = require('crypto-js');
//importation de jsonwebtoken 
const jwt = require('jsonwebtoken');
//importation modèle de la base de donnée models/User.js
const User = require('../models/User');
//signup pour enregistrer le nouvel utilisateur dans la base de donnée
exports.signup = (req, res, next) => {
    //chiffrer l'email avant de l'envoyer dans la base de donnée avec une variable dans .env
    const emailcryptojs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
        //hasher le mot de passe avant de l'envoyer dans la base de donnée
        //salt = 10, combien de foit sera exécuté l'algorithme de hashage
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                //ce qui va être enregistré dans MongoDb (email + mot de passe)
                const user = new User({
                    email: emailcryptojs,
                    password: hash
                });
                //envoyer l'user dans la base de donnée, sauf si l'adresse mail est déjà enregistrée
                user.save()
                    /*status 201 (requête reussi nouvelle ressource créée*/
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(() => res.status(400).json({ message: "L'adresse mail renseignée est déjà utilisée." }));
            })
            .catch(error => res.status(500).json({ error }));
};
//login pour que l'utilisateur puisse se connecter
exports.login = (req, res, next) => {
    //chiffrer l'email de la requête
    const emailcryptojs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
    //chercher dans la base de donnée si l'utilisateur est bien présent
    User.findOne({ email: emailcryptojs })
        .then(user => {
            //si le mail de l'user est null, c'est qu'il n'existe pas
            if (user === null) {
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' })
            } else {
                //contrôle le mot de passe envoyé par l'utilisateur
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        //si le mot de passe est incorrect
                        //fonction inversé si le mot de passe est true, !valid = false
                        if (!valid) {
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' })
                        } else {
                            //sinon le mot de passe est correct
                            //envoie  dans la responce du server du userId et du token auth
                            res.status(200).json({
                                //encodage du userId pour la création  de nouveau objet
                                userId: user._id,
                                token: jwt.sign(
                                    //3 arguments
                                    { userId: user._id },
                                    //clé de chiffrement dans .env
                                    `${process.env.JWT_TOKEN_SECRET}`,
                                    //durée de validité de la clé token
                                    { expiresIn: '12h' }
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }))
};