import mongoose from "mongoose";
import { database } from "../config/env.config";
import { convertStringToBoolean } from "../shared/utils/boolean.utils";

const dbClient = async ()=>{
    const {host, user, password, port, srv} = database.connection;
    const dbName = database.connection.database;
    let useSrv: boolean;
    (typeof srv === 'boolean') ? useSrv = srv : useSrv = convertStringToBoolean(srv);

    const url = `mongodb${useSrv?'+srv':''}://${user}:${password}@${host}${port?`:${port}`:''}/${dbName}?retryWrites=true&w=majority&authSource=admin`

    console.log(url);
    
    // const url = 'mongodb://root:password@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.5.7'

    return await mongoose.connect(url).then(()=>{
        console.log("MongoDB Database Connected Succeffuly");
    }).catch(error=>{
        console.log(error);
        mongoose.disconnect();
        throw error;
    });
};

export default dbClient;