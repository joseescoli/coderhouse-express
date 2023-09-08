// import { __dirname } from './path.js';
// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/.env' })
import "dotenv/config"

if ( !( process.env.MONGO_ATLAS_RW_URL || process.env.MONGO_LOCAL_URL ) && ( process.env.GITHUB_CLIENTID && process.env.GITHUB_CLIENTSECRET && process.env.MONGO_STORE_SESSION_URL_SECRET && process.env.MONGO_STORE_SESSION_SECRET ) )
    console.log("Environment variables in file .env not set. Please assign the ones like in the .env_example file for reference!");

if ( process.env.DEBUG?.toLowerCase() )
    console.log('DEBUG mode')

export default {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_ATLAS_RW_URL: process.env.MONGO_ATLAS_RW_URL,
    MONGO_ATLAS_R_URL: process.env.MONGO_ATLAS_R_URL,
    MONGO_LOCAL_URL: process.env.MONGO_LOCAL_URL,
    GITHUB_CLIENTID: process.env.GITHUB_CLIENTID,
    GITHUB_CLIENTSECRET: process.env.GITHUB_CLIENTSECRET,
    MONGO_STORE_SESSION_URL_SECRET: process.env.MONGO_STORE_SESSION_URL_SECRET,
    MONGO_STORE_SESSION_SECRET: process.env.MONGO_STORE_SESSION_SECRET,
    MONGO_STORE_COOKIE_SESSION_MAXAGE: process.env.MONGO_STORE_COOKIE_SESSION_MAXAGE,
    DEBUG: process.env.DEBUG?.toLowerCase()
}