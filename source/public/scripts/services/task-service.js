import {TaskStorage} from './data/task-storage.js';
import {Task} from './task.js';

export class TaskService {
    constructor(storage) {
        this.storage = storage || new TaskStorage();
        this.storageItems = this.storage.items;
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

    sortItemsBy(data, sortBy, sortOrder) {
        const sortFn = this.sortType[typeof (data[0][sortBy])][sortOrder];
        return [...data].sort((a, b) => sortFn(a[sortBy], b[sortBy]));
    }

    createId () {
        const newId = ((Math.random() * 10000).toString().slice(0,3)) + (this.storageItems.length + 1);
        if (!this.storageItems.find(element => element.id === newId)) {
            return newId;
        } else {
            this.createId();
        }
    }

    showImportanceSymbols (number, iconHtml) {
        let symbols = ``;
        for (let i = 0; i < number; i++) {
            symbols += iconHtml
        }
        return symbols;
    }


    getStatus(status, use) {

        switch (use) {
            case 'text':
                return !status ? 'offen' : 'erledigt'

            case 'checkbox':
                return !status ? '' : 'checked'

            case 'cssClass':
                return !status ? '' : 'entry--completed'
        }
    }

    getCountdownText(dueDate) {
        const remainingTimestamp = dueDate - today.getTime();
        const remainingDays = Math.ceil(remainingTimestamp / (1000 * 60 * 60 * 24));

        switch (true) {
            case (remainingDays > 1):
                return `in ${remainingDays} Tagen`

            case (remainingDays === 1):
                return `in ${remainingDays} Tag`

            case (remainingDays === -1):
                return `vor ${Math.abs(remainingDays)} Tag`

            case (remainingDays < -1):
                return `vor ${Math.abs(remainingDays)} Tagen`

            default:
                return `heute`
        }
    }



    filterItemsBy(data, filterBy) {
        return data.filter(elem => elem[filterBy] === false);
    }



    addTask (form, event) {
        const formData = taskform.elements;
        const creationDateTS = new Date().getTime(); // timestamp
        const dueDateTS = formData.taskDueDate.value ? new Date(formData.taskDueDate.value).getTime() : 0; // timestamp
        const taskId = formData.taskId.value ? formData.taskId.value : this.createId();

        this.entryBuilder(taskEntry);

    }


    // Task aus dem Storage abrufen
    getTask(orderBy, filterBy) {

    }

    // Neuer Task in den Storage einfügen
    addTask (task) {
        const taskEntry = new Task(taskId, formData.taskTitle.value, creationDateTS, formData.taskDescription.value, formData.taskImportanceInput.value, dueDateTS, formData.taskCompleted.checked);

        this.storage.push(taskEntry);
        localStorage.setItem("tasks", JSON.stringify(taskStorage));
    }

    // Task im Storage aktualiseren
    updateTask(task) {

    }


    // Gezielt ein Task aus dem Storage abrufen
    getTaskById(id)   {
        const taskById = this.storageItems.find(el => el.id === id);
        return taskById;
    }

}

export const taskService = new TaskService();


