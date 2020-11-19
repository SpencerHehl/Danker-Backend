import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import _ from 'lodash';

export class MongooseService {
    /**
     * In-Memory Database For Testing Purposes
     */
    mongod = new MongoMemoryServer();

    /**
     * Connect to the in-memory database.
     */
    connect = async (): Promise<void | typeof mongoose> => {
        const uri = await this.mongod.getConnectionString();

        const mongooseOpts: mongoose.ConnectionOptions = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            bufferCommands: false,
        };

        return await mongoose
            .connect(uri, mongooseOpts, (err) => {
                if (err) {
                    console.error('Error connecting to in-memory MongoDB', { error: err });
                    process.exit(1);
                }
            })
            .catch((reason) => {
                console.log('error attempting to connect to MongoDB', reason);
            });
    };

    /**
     * Drop database, close the connection and stop mongod.
     */
    closeDatabase = async (): Promise<boolean> => {
        if (mongoose.connection.readyState == 0) {
            return;
        }
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        return await this.mongod.stop();
    };

    /**
     * Remove all the data for all db collections.
     */
    clearDatabase = async (): Promise<void> => {
        const collections = mongoose.connection.collections;

        if (!_.isNil(collections)) {
            for (const key in collections) {
                const collection = collections[key];
                if (!_.isNil(collection)) {
                    await collection.deleteMany(null);
                }
            }
        }
        return;
    };
}
