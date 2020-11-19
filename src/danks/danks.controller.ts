import { DanksService } from './danks.service';
import { Request } from 'express';
import { IDank } from './danks.model';
import { IDankLeaderStat } from './leaderstat.model';

const dankService = new DanksService();

const submitDank = async (req: Request): Promise<IDank> => {
    try {
        const dankObj = req.body;
        const newDank = await dankService.submitNewDank(dankObj);
        return newDank;
    } catch (err) {
        throw new Error(err.message);
    }
};

const getRecentDanks = async (): Promise<IDank[]> => {
    try {
        const recentDanks = await dankService.getRecentDanks();
        return recentDanks;
    } catch (err) {
        throw new Error(err.message);
    }
};

const getDankerLeaders = async (req: Request): Promise<IDankLeaderStat[]> => {
    try {
        const dateFilter = req.query.filter;
        const dankerLeaders = await dankService.getDankerLeaders(dateFilter);
        return dankerLeaders;
    } catch (err) {
        throw new Error(err.message);
    }
};

const getDankeeLeaders = async (req: Request): Promise<IDankLeaderStat[]> => {
    try {
        const dateFilter = req.query.filter;
        const dankeeLeaders = await dankService.getDankeeLeaders(dateFilter);
        return dankeeLeaders;
    } catch (err) {
        throw new Error(err.message);
    }
};

export { submitDank, getRecentDanks, getDankerLeaders, getDankeeLeaders };
