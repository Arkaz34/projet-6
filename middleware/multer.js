 //multer : pour gérer les requêtes http avec envoie de fichier
 //importation de multer
const multer = require('multer');
// //dictionnaire de MIME TYPES
const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png',
    'images/gif': 'gif'
};
const storage = multer.diskStorage({
    //destination du stockage du fichier
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        //supprimer les espaces dans le nom du fichier
        const name = file.originalname.split(' ').join('_');
        const extention = MIME_TYPES[file.mimetype];

        callback(null, name + Date.now() + '.' + extention);
    }
});
//exportation du middleware multer
module.exports = multer({storage}).single('images');
