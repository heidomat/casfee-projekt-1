import {taskStore} from '../services/task-store.js'

export class DataController {

    async getTasks (req, res) {
        res.json((await taskStore.all()));
    }

    addTask = async (req, res) => {
        res.json((await taskStore.add(req.body)));
    }

    getTaskById = async (req, res) => {
        res.json((await taskStore.getById(req.params.id)));
    }

    update = async (req, res) => {
        res.json((await taskStore.update(req.params.id)));
    }
}

export const dataController = new DataController();
