import { Dank, IDank } from './danks.model';
import { User, IUser } from './user.model';
import { IDankLeaderStat } from './leaderstat.model';
import moment from 'moment';

export class DanksService {
    public async submitNewDank(dank: IDank): Promise<IDank> {
        try {
            let dankee = await User.findById(dank.dankee.userId);
            if (dankee) {
                dank.dankee = dankee;
            } else {
                dankee = new User(dank.dankee);
                dankee._id = dank.dankee.userId;
                await dankee.save();
                dank.dankee = dankee;
            }
            let danker = await User.findById(dank.danker.userId);
            if (danker) {
                dank.danker = danker;
            } else {
                danker = new User(dank.danker);
                danker._id = dank.danker.userId;
                await danker.save();
                dank.danker = danker;
            }
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
                    dateTime: 'desc',
                })
                .limit(3)
                .exec();
            return dankList;
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to retrieve danks due to error.`);
        }
    }

    public async getDankerLeaders(dateFilter: string): Promise<IDankLeaderStat[]> {
        try {
            const convDateFilter = this.convertDateFilter(dateFilter);
            const topDankers = await Dank.aggregate()
                .match({ dateTime: { $gt: convDateFilter } })
                .group({ _id: '$danker._id', count: { $sum: 1 } })
                .sort({ count: -1 })
                .lookup({
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'leaderInfo',
                })
                .unwind('$leaderInfo');
            return topDankers;
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to retrieve danker leaders due to error.`);
        }
    }

    public async getDankeeLeaders(dateFilter: string): Promise<IDankLeaderStat[]> {
        try {
            const convDateFilter = this.convertDateFilter(dateFilter);
            const topDankees = await Dank.aggregate()
                .match({ dateTime: { $gt: convDateFilter } })
                .group({ _id: '$dankee._id', count: { $sum: 1 } })
                .sort({ count: -1 })
                .lookup({
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'leaderInfo',
                })
                .unwind('$leaderInfo');
            return topDankees;
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to retrieve dankee leaders due to error.`);
        }
    }

    private convertDateFilter(dateFilter: string): string {
        const utcNow = moment.utc();
        let newFilter: string;
        switch (dateFilter) {
            case 'today':
                newFilter = utcNow.startOf('day').toISOString();
                break;
            case 'week':
                newFilter = utcNow.startOf('day').subtract(7, 'd').toISOString();
                break;
            case 'month':
                newFilter = utcNow.startOf('day').subtract(30, 'd').toISOString();
                break;
            case 'alltime':
                newFilter = '';
                break;
            default:
                newFilter = '';
                break;
        }
        return newFilter;
    }
}
