//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//vencimiento del token (60seg, 60min, 24hrs, 30 dias)
process.env.CADUCIDAD_TOKEN = '48h';

//Seed o semilla de autenticacion
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//BD
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//Google Client
process.env.CLIENT_ID = process.env.CLIENT_ID || '880182273845-4babeci6vedrsfv6qjv4rt81h8f5gftd.apps.googleusercontent.com';