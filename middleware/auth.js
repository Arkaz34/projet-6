//importation de jsonwebtoken (token)
const jwt = require('jsonwebtoken');
//exportation du middleware module
module.exports = (req, res, next) => {
    try {
        /*'authorization' peut être utilisé pour fournir des informations 
        d'identification qui authentifient un agent utilisateur auprès d'un serveur*/
        const token = req.headers.authorization.split(' ')[1];
        //vérification du token
        const decodedToken = jwt.verify(token, `${process.env.JWT_TOKEN_SECRET}`);
        //vérification du user
        const userId = decodedToken.userId;
        //vérifie si user est le même que celui déjà créé 
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable'
        } else {
            res.locals.userId = userId
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }
}
