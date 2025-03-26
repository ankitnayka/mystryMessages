import mongoose from 'mongoose';

type ConnectionObject={
    isConnected?: number
}


const connection:ConnectionObject = {}


async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log('Using existing connection')
        return
    }

    try {
        const db= await mongoose.connect(process.env.MONGO_URI || '',{})

        connection.isConnected = db.connections[0].readyState
        // console.log(db);
        
        console.log('Db connection successfully')

    } catch (error) {
        console.log('Db connection failed',error)
        process.exit(1)
    }
}

export default dbConnect