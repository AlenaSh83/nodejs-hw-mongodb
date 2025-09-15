import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.MONGODB_USER || 'aliona333com_db_user';
const password = process.env.MONGODB_PASSWORD;
const url = process.env.MONGODB_URL || 'cluster0.ad47ej3.mongodb.net';
const db = process.env.MONGODB_DB || 'nodejs-hw-mongodb';

const URI = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

function initDBConnection() {
  mongoose.connect(URI)
    .then(() => {
      console.log('Mongo connection successfully established!');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
}

export default initDBConnection;