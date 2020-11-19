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
        this.mongod.getUri().then(async (mongoUri) => {
            const mongooseOpts: mongoose.ConnectionOptions = {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                bufferCommands: false,
            };
            await mongoose.connect(mongoUri, mongooseOpts);
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
