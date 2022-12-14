 //multer : pour gérer les requêtes http avec envoie de fichier
 //importation de multer
const multer = require('multer');
// //dictionnaire de MIME TYPES
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/gif': 'gif'
};
const storage = multer.diskStorage({
    //destination du stockage du fichier
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //donner un nom au fichier
    filename: (req, file, callback) => {
        //supprimer les espaces dans le nom du fichier d'origine
        let name = file.originalname.split(' ').join('_');
        console.log(file);
        const extention = MIME_TYPES[file.mimetype];
        //remplace .jpg par null
        name = name.replace("." + extention, "")
        callback(null, name + Date.now() + '.' + extention);
    }
});
//exportation du middleware multer
module.exports = multer({storage}).single('image');
