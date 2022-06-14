import Datastore from 'nedb-promises';

export class DataStorage {
    constructor(db) {
        this.db = db || new Datastore({filename: './data/tasks.db', autoload: true});
    }

    async add(item) {
        return this.db.insert(item);
    }

    async delete(id) {
        return this.db.remove({_id: id});
    }

    async all(sortBy, sortOrder, filterBy) {
        if (filterBy) {
            return this.db.find({[filterBy]: false}).sort({[sortBy]: [+(sortOrder)]}).exec();
        }
        return this.db.find({}).sort({[sortBy]: [+(sortOrder)]}).exec();
    }

    async getById(id) {
        return this.db.findOne({_id: id});
    }

    async update(id, changes) {
        await this.db.update({_id: id}, {$set: changes});
        return this.getById(id);
    }

}

export const dataStore = new DataStorage();
