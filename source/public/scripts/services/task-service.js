import {TaskStorage} from './data/task-storage.js';
import {Task} from './task.js';

export class TaskService {
    constructor(storage) {
        this.storage = storage || new TaskStorage();
        this.items = [];
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

    loadData() {
        this.items = this.storage.getAll().map(item => new Task(item.id, item.title, item.creationDate, item.description, item.importance, item.dueDate, item.completed));
    }

    save() {
        this.storage.update(this.items.map(item => item.toJSON()));
    }

    addTask(task) {
        this.items.push(task);
        this.save();
    }

    updateTask(task) {
        const index = this.items.findIndex((el) => el.id === task.id);
        this.items[index] = task;
        this.save();
    }

    getTaskById(id) {
        return this.items.find(el => el.id === id);
    }

    getNote(sortBy, sortOrder, filterBy) {

        const sortFn = this.sortType[typeof (this.items[0][sortBy])][sortOrder];
        const sortedList =  [...this.items].sort((a, b) => sortFn(a[sortBy], b[sortBy]));

        if (!filterBy) {
            return sortedList;
        }

        return sortedList.filter(elem => elem[filterBy] === false);

    }


    createId() {
        const itemLength = this.items.length ? this.items.length : 0;
        const newId = (Math.floor(Math.random() * 100000).toString().slice(0, 3)) + (itemLength + 1);
        if (this.items.find(el => el.id === newId)) this.createId();
        return newId;
    }



}

export const taskService = new TaskService();


