import mongoose from "mongoose";
mongoose.set('strictQuery', true);

const connectDb = async (url) => {
    try {
        console.warn("DB Connection Established");
        return mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (error) {
        console.log(`Error: ${error.message}`)
        return 'Something not right with the database'
    }
}

export default connectDb;