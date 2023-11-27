// import { __dirname } from './path.js';
// import dotenv from 'dotenv'
// dotenv.config({ path: __dirname + '/.env' })
import "dotenv/config"

const testing = (process.argv[1]?.toLowerCase().includes('jest.js') || process.argv[2]?.toLowerCase().includes('test.js') || process.argv[3]?.toLowerCase().includes('test.js'))
    testing && console.log('TESTING mode')

if ( !( process.env.MONGO_ATLAS_RW_URL || process.env.MONGO_LOCAL_URL ) && ( process.env.GITHUB_CLIENTID && process.env.GITHUB_CLIENTSECRET && process.env.MONGO_STORE_SESSION_URL_SECRET && process.env.MONGO_STORE_SESSION_SECRET ) )
    console.log("Environment variables in file .env not set. Please assign the ones like in the .env_example file for reference!");

if ( process.env.DEBUG?.toLowerCase() === 'true' || process.env.DEBUG === 1 )
    console.log('DEBUG mode')

export default {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8080,
    MONGO_ATLAS_RW_URL: process.env.MONGO_ATLAS_RW_URL,
    MONGO_ATLAS_R_URL: process.env.MONGO_ATLAS_R_URL,
    MONGO_LOCAL_URL: process.env.MONGO_LOCAL_URL,
    MONGO_ATLAS_TEST_RW_URL: process.env.MONGO_ATLAS_TEST_RW_URL,
    MONGO_LOCAL_TEST_URL: process.env.MONGO_LOCAL_TEST_URL,
    GITHUB_CLIENTID: process.env.GITHUB_CLIENTID,
    GITHUB_CLIENTSECRET: process.env.GITHUB_CLIENTSECRET,
    MONGO_STORE_SESSION_URL_SECRET: process.env.MONGO_STORE_SESSION_URL_SECRET,
    MONGO_STORE_SESSION_SECRET: process.env.MONGO_STORE_SESSION_SECRET,
    MONGO_STORE_COOKIE_SESSION_MAXAGE: process.env.MONGO_STORE_COOKIE_SESSION_MAXAGE,
    EMAIL_PORT_ETHEREAL: process.env.EMAIL_PORT_ETHEREAL,
    EMAIL_HOST: process.env.EMAIL_HOST,
    FAKEMAIL: process.env.FAKEMAIL,
    PASSWORD: process.env.PASSWORD,
    NAME: process.env.NAME,
    TESTING: testing,
    APP_TITLE: process.env.APP_TITLE,
    DEBUG: process.env.DEBUG?.toLowerCase(),
    // En caso de no definirse establecerse por defecto en 1 hora (3600 segundos)
    RESET_TOKEN_EXPIRATION: process.env.RESET_TOKEN_EXPIRATION || 3600,
    DAYS_TO_REMOVE_INACTIVE_USERS: process.env.DAYS_TO_REMOVE_INACTIVE_USERS || 2,
    SERVER_LOCALHOST: `http://localhost:${process.env.PORT || 8080}`,
    RAILWAY_APP: 'https://coderhouse-express-production-e90e.up.railway.app'
}