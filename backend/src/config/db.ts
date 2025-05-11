import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        if (!process.env.MONGTO_URL) {
            throw new Error('MONGTO_URL is not defined in the environment variables')
        }
        const conn = await mongoose.connect(process.env.MONGTO_URL!);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("❌ MongoDB connection error:", error)
        process.exit(1);
    }
}

export default connectDB;