import Datastore from 'nedb-promises';

export class TaskStorage {
    constructor(db) {
        this.db = db || new Datastore({filename: './data/tasks.db', autoload: true});

        this.sortType = {
            'number': {
                'asc': (a, b) => a - b,
                'desc': (a, b) => b - a
            },
            'string': {
                // eslint-disable-next-line no-nested-ternary
                'asc': (a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : a.toLowerCase() < b.toLowerCase() ? -1 : 0,
                // eslint-disable-next-line no-nested-ternary
                'desc': (a, b) => b.toLowerCase() > a.toLowerCase() ? 1 : b.toLowerCase() < a.toLowerCase() ? -1 : 0
            }
        }

    }


    async add(item) {
        return await this.db.insert(item);
    }

    async all() {
        return this.db.find({}).sort({ creationDate: -1 }).exec();
    }

    async getById(id) {
        return this.db.findOne({_id: id});
    }

    async update(id, changes) {
        await this.db.update({_id: id}, {$set: changes});
        return await this.getById(id);
    }

}

export const taskStore = new TaskStorage();
