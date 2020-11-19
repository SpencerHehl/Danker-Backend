import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { MongooseService } from '../utils/mongoose';
import { DanksService } from './danks.service';
import { IDank } from './danks.model';

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
        let newDank: IDank = {
            danker: {
                displayName: "Simon Franks",
                userId: "simon.franks@schehl49gmail.onmicrosoft.com"
            },
            dankee: {
                displayName: "Elise Weber",
                userId: "elise.weber@schehl49gmail.onmicrosoft.com"
            },
            dankText: "Elise Rocks",
            dateTime: new Date()
        };

        const savedDank = await dankService.submitNewDank(newDank);
        expect(savedDank.danker.displayName).to.equal(newDank.danker.displayName);
        expect(savedDank.danker.userId).to.equal(newDank.danker.userId);
        expect(savedDank.dankee.displayName).to.equal(newDank.dankee.displayName);
        expect(savedDank.dankee.userId).to.equal(newDank.dankee.userId);
        expect(savedDank.dankText).to.equal(newDank.dankText);
    })
})