import mongoose from 'mongoose';

//export const connectionString = 'mongodb://127.0.0.1:27017/ecommerce';
export const connectionString = 'mongodb+srv://read_user:lwol9DAS3i8lcNUL@documents.0vx3shf.mongodb.net/ecommerce?retryWrites=true&w=majority';

export const dbConnect = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB database!');
    } catch (error) {
        console.log(error);
    }

}

export const dbDisconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB database!');
    } catch (error) {
        console.log(error);
    }
    
}