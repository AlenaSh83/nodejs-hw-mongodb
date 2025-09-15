import setupServer from './server.js';
import initDBConnection from './db/initMongoConnection.js';


initDBConnection();


setupServer();