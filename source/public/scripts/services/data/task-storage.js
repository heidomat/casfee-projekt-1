export class TaskStorage {
    constructor() {
        const items = JSON.parse(localStorage.getItem('tasks')) || [];
        this.items = items;
        localStorage.setItem('tasks', JSON.stringify(items));
    }

    getAll() {
        return this.items;
    }

    update(items) {
        localStorage.setItem('tasks', JSON.stringify(items));
        return this.items;
    }



}
