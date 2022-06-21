/* eslint class-methods-use-this:0 */
import {dataStore} from '../services/data-store.js'

export class DataController {

    async getTasks(req, res) {
        res.json((await dataStore.all(req.query.sortBy, req.query.sortOrder, req.query.filterBy)));
    }

    async addTask(req, res) {
        res.json((await dataStore.add(req.body)));
    }

    async deleteTask(req, res) {
        res.json((await dataStore.delete(req.params.id)));
    }

    async getTaskById(req, res) {
        res.json((await dataStore.getById(req.params.id)));
    }

    async update(req, res) {
        res.json((await dataStore.update(req.params.id, req.body)));
    }

}

export const dataController = new DataController();
