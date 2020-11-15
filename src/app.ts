import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import DanksRouter from './danks/danks.router';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
    }

    private middleware(): void {
        this.express.use(cors());
        this.express.use(bodyParser.json({ limit: '10mb', type: ['application/vnd.api+json', 'application/json'] }));
        this.express.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
        this.express.get('/', (req, res, next) => {
            res.send('Success!');
        });
        this.express.use('/api', DanksRouter);
    }
}

export default new App().express;
