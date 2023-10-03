import mongoose from 'mongoose';
import config from '../../config.js';
import { logger } from '../../utils/logger.js';

export const connectionString = process.argv[2]?.toLowerCase() === 'atlas' ? config.MONGO_ATLAS_RW_URL : config.MONGO_LOCAL_URL

// export const connectionString = config.MONGO_LOCAL_URL
// export const connectionString = config.MONGO_ATLAS_R_URL
// export const connectionString = config.MONGO_ATLAS_RW_URL
const DB = connectionString.includes('mongodb+srv') ? 'Mongo Atlas' : 'Mongo localhost'

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