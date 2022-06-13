import {httpService} from "./http-service.js";


export class TaskService {
    constructor() {
        //this.storage = storage || new TaskStorage();
        //this.items = [];
        /*
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
        }*/
    }


    async addTask(task) {
        return httpService.ajax("POST", "/tasks/", task);
    }

    async updateTask(task) {
        /*
        const index = this.items.findIndex((el) => el.id === task.id);
        this.items[index] = task;
        this.save();
         */
        return httpService.ajax("PUT", `/tasks/${task.id}`);

    }

    async getTaskById(id) {
        return httpService.ajax("GET", `/tasks/${id}`);
    }

    //async getAll(sortBy, sortOrder, filterBy) {
    async getAll() {
        return httpService.ajax("GET", "/tasks", undefined);

        /*
        const sortFn = this.sortType[typeof (this.items[0][sortBy])][sortOrder];
        const sortedList =  [...this.items].sort((a, b) => sortFn(a[sortBy], b[sortBy]));

        if (!filterBy) {
            return sortedList;
        }

        return sortedList.filter(elem => elem[filterBy] === false);
        */

    }

    async createId() {
        const allTasks = await this.getAll();
        const itemLength = allTasks.length || 0;
        const newId = (Math.floor(Math.random() * 100000).toString().slice(0, 3) + (itemLength + 1));
        if (await this.getTaskById(newId)) this.createId();
        return newId;
    }







}

export const taskService = new TaskService();


