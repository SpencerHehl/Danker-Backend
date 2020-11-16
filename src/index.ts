import * as http from 'http';
import * as bluebird from 'bluebird';
import mongoose from 'mongoose';
import App from './app';

const options: any = {
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    family: 4,
    keepAlive: true,
    poolSize: 10,
    promiseLibrary: bluebird,
    socketTimeoutMS: 45000,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const cosmosDbName = 'danker-backend';
const primaryMasterKey = 'PCBKPA6klF45RPeWLz1uovEQKiK3330Mn2Qk4DafmENu5OFrQ3JK0VNjjGx5LkDRkk2rox826lFxGyF29Mwkbg==';
const mongooseUri = `mongodb://${cosmosDbName}:${primaryMasterKey}@${cosmosDbName}.documents.azure.com:10255/mean-dev?ssl=true&sslverifycertificate=false`;

try {
    mongoose.connect(mongooseUri, options, (err) => {
        if (err) {
            console.error('Error connecting to MongoDB', { error: err });
            process.exit(1);
        } else {
            console.log('Success in conneting to mongodb');
        }
    });
} catch (err) {
    console.error('Error connecting to MongoDB', { error: err });
    process.exit(1);
}

function normalizePort(val: number | string): number | string | boolean {
    const normalizedPort: number = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(normalizedPort)) {
        return val;
    } else if (normalizedPort >= 0) {
        return normalizedPort;
    } else {
        return false;
    }
}
const port = normalizePort(8080);
function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);

function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}

server.on('listening', onListening);
