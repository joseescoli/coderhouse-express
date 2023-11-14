import mongoose from 'mongoose';
import config from '../../config.js';
import { logger } from '../../utils/logger.js';

const testing = config.TESTING

export const connectionString = 
testing ? config.MONGO_ATLAS_TEST_RW_URL :
// testing ? config.MONGO_LOCAL_TEST_URL :
process.argv[2]?.toLowerCase() === 'atlas' ? config.MONGO_ATLAS_RW_URL : config.MONGO_LOCAL_URL

// export const connectionString = config.MONGO_LOCAL_URL
// export const connectionString = config.MONGO_ATLAS_R_URL
// export const connectionString = config.MONGO_ATLAS_RW_URL
// export const connectionString = config.MONGO_ATLAS_TEST_RW_URL
const DB =
testing ? 'Mongo Atlas: Testing'
:
connectionString.includes('mongodb+srv') ? 'Mongo Atlas' : 'Mongo localhost'

export const dbConnect = async () => {
    try {
        await mongoose.connect(connectionString);
        logger.debug(`Connected to ${DB} database!`);
    } catch (error) {
        logger.error(error.message)
    }

}

export const dbDisconnect = async () => {
    try {
        await mongoose.disconnect();
        logger.debug(`Disconnected from ${DB} database!`);
    } catch (error) {
        logger.error(error.message)
    }
    
}