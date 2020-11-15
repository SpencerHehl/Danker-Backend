import { Request, Response, Router } from 'express';
import * as DankController from './danks.controller';
import { IDank } from './danks.model';
import { IDankLeaderStat } from './leaderstat.model';

const DanksRouter: Router = Router();

DanksRouter.route('/danke').post((req: Request, res: Response) => {
    DankController.submitDank(req)
        .then((dank: IDank) => {
            res.status(201).json(dank);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

DanksRouter.route('/danke/recents').get((req: Request, res: Response) => {
    DankController.getRecentDanks()
        .then((danks: IDank[]) => {
            res.status(200).json(danks);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

DanksRouter.route('/leaders/danker').get((req: Request, res: Response) => {
    DankController.getDankerLeaders()
        .then((leaders: IDankLeaderStat[]) => {
            res.status(200).json(leaders);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

DanksRouter.route('/leaders/dankee').get((req: Request, res: Response) => {
    DankController.getDankeeLeaders()
        .then((leaders: IDankLeaderStat[]) => {
            res.status(200).json(leaders);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

export default DanksRouter;
