import {TaskStorage} from './data/task-storage.js';
import {Task} from './task.js';

export class TaskService {
    constructor(storage) {
        this.storage = storage || new TaskStorage();
        this.items = [];
        this.sortType  = {
            'number': {
                'asc': (a, b) => a - b,
                'desc': (a, b) => b - a
            },
            'string': {
                'asc': (a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : a.toLowerCase() < b.toLowerCase() ? -1 : 0,
                'desc': (a, b) => b.toLowerCase() > a.toLowerCase() ? 1 : b.toLowerCase() < a.toLowerCase() ? -1 : 0
            }
        }
    }

    loadData () {
        this.items = this.storage.getAll().map(item => new Task(item.id, item.title, item.creationDate, item.description, item.importance, item.dueDate, item.completed));
    }

    save() {
        this.storage.update(this.items.map(item => item.toJSON()));
    }

    addTask (task) {
        this.items.push(task);
        this.save();
    }

    updateTask(task) {
        const index = this.items.findIndex((el) => el.id === task.id);
        this.items[index] = task;
        this.save();
    }

    getTaskById(id)   {
        return this.items.find(el => el.id === id);
    }

    sortItemsBy(data, sortBy, sortOrder) {
        const sortFn = this.sortType[typeof (data[0][sortBy])][sortOrder];
        return [...data].sort((a, b) => sortFn(a[sortBy], b[sortBy]));
    }

    filterItemsBy(data, filterBy) {
        return data.filter(elem => elem[filterBy] === false);
    }

    createId () {
        const itemLength  = this.items.length ? this.items.length : 0;
        const newId = (Math.floor(Math.random() * 100000).toString().slice(0,3)) + (itemLength + 1);
        if (this.items.find(el => el.id === newId) ) this.createId();
        return newId;
    }

    setCookie (cookieName, cookieValue, expiration) {
        const today = new Date();
        today.setTime(today.getTime() + (expiration*24*60*60*1000));
        const expires = `expires=${today.toUTCString()}` ;
        document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
    }

    getCookie (cookieName) {
        const name = `${cookieName}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    deleteCookie (cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

}

export const taskService = new TaskService();


