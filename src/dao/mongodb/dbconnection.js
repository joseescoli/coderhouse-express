import mongoose from 'mongoose';
import config from '../../config.js';

// export const connectionString = config.MONGO_LOCAL_URL
// export const connectionString = config.MONGO_ATLAS_R_URL
export const connectionString = config.MONGO_ATLAS_RW_URL
const DB = connectionString.includes('mongodb+srv') ? 'Mongo Atlas' : 'Mongo localhost'

export const dbConnect = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log(`Connected to ${DB} database!`);
    } catch (error) {
        console.log(error);
    }

}

export const dbDisconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log(`Disconnected from ${DB} database!`);
    } catch (error) {
        console.log(error);
    }
    
}