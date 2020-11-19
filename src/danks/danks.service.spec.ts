import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { MongooseService } from '../utils/mongoose';
import { DanksService } from './danks.service';
import { IDank } from './danks.model';
import moment, { utc } from 'moment';

const dbService = new MongooseService();
const dankService = new DanksService();
describe('Dank Service', function() {
    before(async () => {
        await dbService.connect();
    });

    beforeEach(async () => {
        await dbService.clearDatabase();
    });

    after(async () => {
        await dbService.closeDatabase();
    });

    afterEach(async () => {
        sinon.restore();
    });

    it('Save the dank when submitted', async function () {
        const utcNow = moment.utc().format();
        const newDank: IDank = {
            danker: {
                displayName: 'Simon Franks',
                userId: 'simon.franks@schehl49gmail.onmicrosoft.com',
            },
            dankee: {
                displayName: 'Elise Weber',
                userId: 'elise.weber@schehl49gmail.onmicrosoft.com',
            },
            dankText: 'Elise Rocks',
            dateTime: new Date(utcNow),
        };

        const savedDank = await dankService.submitNewDank(newDank);
        expect(savedDank.danker.displayName).to.equal(newDank.danker.displayName);
        expect(savedDank.danker.userId).to.equal(newDank.danker.userId);
        expect(savedDank.dankee.displayName).to.equal(newDank.dankee.displayName);
        expect(savedDank.dankee.userId).to.equal(newDank.dankee.userId);
        expect(savedDank.dankText).to.equal(newDank.dankText);
    });

    it('Should return a date string equal to start of today', async function () {
        const date = dankService.convertDateFilter('today');
        expect(date).to.equal(moment.utc().startOf('day').toISOString());
    });

    it('Should return a date string equal to start of 7 days ago for week', async function () {
        const date = dankService.convertDateFilter('week');
        expect(date).to.equal(moment.utc().startOf('day').subtract(7, 'd').toISOString());
    });

    it('Should return a date string equal to start of 30 days ago for month', async function () {
        const date = dankService.convertDateFilter('month');
        expect(date).to.equal(moment.utc().startOf('day').subtract(30, 'd').toISOString());
    });

    it('Should return an empty string for alltime', async function () {
        const date = dankService.convertDateFilter('alltime');
        expect(date).to.equal(moment.utc().startOf('year').toISOString());
    });

    it('Should return dankee leaders by filter if more recent', async function () {
        const utcNow = moment.utc().format();
        const newDank: IDank = {
            danker: {
                displayName: 'Simon Franks',
                userId: 'simon.franks@schehl49gmail.onmicrosoft.com',
            },
            dankee: {
                displayName: 'Elise Weber',
                userId: 'elise.weber@schehl49gmail.onmicrosoft.com',
            },
            dankText: 'Elise Rocks',
            dateTime: new Date(utcNow),
        };

        await dankService.submitNewDank(newDank);

        const leaders = await dankService.getDankeeLeaders('today');
        expect(leaders.length).to.be.greaterThan(0);
    });

    it('Should not return dankee leaders by filter if not more recent', async function () {
        const utcNow = moment.utc().subtract(30, 'd').format();
        const newDank: IDank = {
            danker: {
                displayName: 'Simon Franks',
                userId: 'simon.franks@schehl49gmail.onmicrosoft.com',
            },
            dankee: {
                displayName: 'Elise Weber',
                userId: 'elise.weber@schehl49gmail.onmicrosoft.com',
            },
            dankText: 'Elise Rocks',
            dateTime: new Date(utcNow),
        };

        await dankService.submitNewDank(newDank);

        const leaders = await dankService.getDankeeLeaders('week');
        expect(leaders.length).to.equal(0);
    });

    it('Should return everything if alltime', async function () {
        const utcNow = moment.utc().subtract(30, 'd').format();
        const newDank: IDank = {
            danker: {
                displayName: 'Simon Franks',
                userId: 'simon.franks@schehl49gmail.onmicrosoft.com',
            },
            dankee: {
                displayName: 'Elise Weber',
                userId: 'elise.weber@schehl49gmail.onmicrosoft.com',
            },
            dankText: 'Elise Rocks',
            dateTime: new Date(utcNow),
        };

        await dankService.submitNewDank(newDank);

        const leaders = await dankService.getDankeeLeaders('alltime');
        expect(leaders.length).to.be.greaterThan(0);
    });
});
