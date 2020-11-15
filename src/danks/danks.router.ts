import { Request, Response, Router } from 'express';

const DanksRouter: Router = Router();

DanksRouter.route('/danke').post((req: Request, res: Response) => {
    console.log('blah');
});

DanksRouter.route('/danke/recents').get((req: Request, res: Response) => {
    console.log('blah');
});

DanksRouter.route('/leaders/danker').get((req: Request, res: Response) => {
    console.log('blah');
});

DanksRouter.route('/leaders/dankee').get((req: Request, res: Response) => {
    console.log('blah');
});

export default DanksRouter;
