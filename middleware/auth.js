//importation de jsonwebtoken (token)
const jwt = require('jsonwebtoken');
//exportation de le fonction du middleware
module.exports = (req, res, next) => {
    try {
        /*'authorization' peut être utilisé pour fournir des informations 
        d'identification qui authentifient un agent utilisateur auprès d'un serveur*/
        //récupérer le token dans le headers aut : bearer (qui porte le token) token 
        //et split permet de couper le caractère (bearer) à partir de l'espace
        const token = req.headers.authorization.split(' ')[1];
        //décoder le token qui contient l'userId et le temps d'expiration du token
        const decodedToken = jwt.verify(token, `${process.env.JWT_TOKEN_SECRET}`);
        //récupérer userId dans le token et le comparé avec l'user en clair
        const userId = decodedToken.userId;
        //si user n'est pas le même non valide
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable'
        } else {
            // si tous est bon passer au midddlware suivant
            res.locals.userId = userId
            next();
        }
        //si il y a des erreurs dans le try 
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }
}
