//importation du models de la base de donnée mongoDb
const ModelsSauce = require('../models/modelsSauce');
//importation du module fs de node pour acccéder aux fichiers du serveur pour les supprimer 
const fs = require('fs');
//retourne l'objet au document html
exports.getSauce = (req, res, next) => {
    ModelsSauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
    console.log('Sauce récupérée');
};
//retourne les détails de l'objet au document html
exports.getSauceById = (req, res, next) => {
    ModelsSauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
    console.log('Sauce particulière récupérée');
};
//create permet la création de ressources (sauces)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new ModelsSauce({
        ...sauceObject,
        //récupèrer le segment de base de l'url
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersDisliked: [' ']
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce ajoutée" }))
        .catch(error => res.status(400).json({ error }));
    console.log('Sauce initialisée');
};
//modification sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    if (req.file) {
        //findOne permet de rechercher des données dans une collection dans MongoDB
        ModelsSauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (res.locals.userId != sauce.userId) {
                    res.status(403).json({ message: 'Utilisateur non autoriser !' })
                }
                //la méthode unlink permet de supprimer un fichier. 
                //ici on supprime la photo qui à été modifié
                const fileName = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${fileName}`, () => {
                    console.log('images supprimer');
                })
            })
    }
    //updateOne permet la modification de ressources (maj)
    ModelsSauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(400).json({ error }));
    console.log('Sauce modifiée');
};
//supprimer une sauce
//delete permet la suppression de ressources
exports.deleteSauce = (req, res, next) => {
    //interroger un document dans la collection avec findOne
    ModelsSauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //contrôle du userId pour donner accés à la supression
            if (res.locals.userId != sauce.userId) {
                res.status(403).json({ message: 'Utilisateur non autoriser !' })
            }
            //récupération du nom de la photo à supprimer
            const filename = sauce.imageUrl.split('/images/')[1];
            //suppression de l'img dans le dossier images
            fs.unlink(`images/${filename}`, () => {
                ModelsSauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
                console.log('Sauce supprimée');
            });
        })
        .catch(error => res.status(500).json({ error }));
};
//like sauce
exports.likeSauce = (req, res, next) => {
    if (req.body.like == 1) {
        //mise à jour objet bdd
        ModelsSauce.updateOne(
            { _id: req.params.id },
            {$push: { usersLiked: req.body.userId },
            $inc: { likes: +1 }}
        )
            .then(() => res.status(200).json({ message: 'Sauce liké !' }))
            .catch(error => res.status(400).json({ error }));
    }
    //like = 0 pas de like
    if (req.body.like == 0) {
        ModelsSauce.findOne({ _id: req.params.id })
            .then((sauce) => {            
                if (sauce.usersLiked.includes(req.body.userId)) {
                    ModelsSauce.updateOne(
                        { _id: req.params.id },
                        {$pull: { usersLiked: req.body.userId },
                        $inc: { likes: -1 }}
                    )
                        .then(() => res.status(200).json({ message: 'Cette sauce ne vous intéresse plus !' }))
                        .catch(error => res.status(400).json({ error }));
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    //mise à jour objet bdd
                    ModelsSauce.updateOne(
                        { _id: req.params.id },
                        {$pull: { usersDisliked: req.body.userId },
                        $inc: { dislikes: -1 }}
                    )
                        .then(() => res.status(200).json({ message: 'Cette sauce ne vous intéresse plus !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            //}
            })
            .catch(error => res.status(400).json({ error }));
    }
    if (req.body.like == -1) {
        //mise à jour objet bdd
        ModelsSauce.updateOne(
            { _id: req.params.id },
            {$push: { usersDisliked: req.body.userId },
            $inc: { dislikes: +1 }}
        )
            .then(() => res.status(200).json({ message: 'Sauce disliké !' }))
            .catch(error => res.status(400).json({ error }));
        console.log('Sauce disliké !');
    }
    console.log(req.body);
};