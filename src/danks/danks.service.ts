import { Dank, IDank } from './danks.model';
import { IDankLeaderStat } from './leaderstat.model';

export class DanksService {
    public async submitNewDank(dank: IDank): Promise<IDank> {
        try {
            const newDank = await Dank.create(dank);
            return newDank;
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to save new dank due to error.`);
        }
    }

    public async getRecentDanks(): Promise<IDank[]> {
        try {
            const dankList = await Dank.find()
                .sort({
                    dateTime: 'desc'
                })
                .limit(3)
                .exec()
            return dankList;
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to retrieve danks due to error.`);
        }
    }

    public async getDankerLeaders(): Promise<IDankLeaderStat[]> {
        try {
            const topDankers = await Dank.aggregate()
                .group({ _id: '$danker', count: { $sum: 1 } })
                .lookup({
                    from: 'User',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'User',
                });
            return topDankers;
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to retrieve danker leaders due to error.`);
        }
    }

    public async getDankeeLeaders(): Promise<IDankLeaderStat[]> {
        try {
            const topDankees = await Dank.aggregate()
                .group({ _id: '$dankee', count: { $sum: 1 } })
                .lookup({
                    from: 'User',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'User',
                });
            return topDankees;
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to retrieve dankee leaders due to error.`);
        }
    }
}
