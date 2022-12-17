//-------------------
//créer un server
//-------------------
//créer un programe qui va écouter, attendre des requêtes http et qui va y répondre
/*importer le package http de node avec require qui permet d'inclure des modules 
qui existent dans des fichiers séparés*/
const http = require('http');
//importer l'application "app" depuis le fichier backend
const app = require('./app');
//normalizePort renvoie un port valide, qu'il soit fourni 
//sous la forme d'un numéro ou d'une chaîne
const normalizePort = val =>{
  const port = parseInt(val, 10);
  if(isNaN(port)){
    return val;
  }
  if(port >= 0){
    return port;
  }
  return false;
};
//dire à l'app express quel port on utilise
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/*recherche les différentes erreurs et les gère de manière appropriée. 
Elle est ensuite enregistrée dans le serveur*/
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
/*La méthode createServer() prend en argument la fonction 
qui sera appelé à chaque requête reçu par le server*/ 
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
//server prêt
//le serveur doit écouter, attendre les requêtes envoyées sur le port 3000
server.listen(port);