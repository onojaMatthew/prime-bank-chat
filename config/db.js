import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import winston from "winston";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname + "/../.env") });

let db_url;
const env = process.env.NODE_ENV || 'development';
if ( env === "development" ) {
  db_url = process.env.DEV_DB;
} else {
  db_url = process.env.PROD_DB;
}

export const db = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect( db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    poolSize: 5,
    retryWrites: false,
    socketTimeoutMS: 45000,
  } )
    .then( () => {
      winston.info( "Connection to database established" );
    } )
    .catch( err => {
      winston.error( `Connection failed. ${ err.message }` );
    } );
  
  mongoose.set( "useFindAndModify", false );
  mongoose.set( "useCreateIndex", true );
}