import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("DB connected");
        })

        connection.on('error', (err) => {
            console.log("Db connection error: " + err);
            process.exit();
        })

    } catch (error) {
        console.log("Something Went Wrong")
        console.error("Error: ", error);

    }
}