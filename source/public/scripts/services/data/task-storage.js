export class TaskStorage {
    constructor() {
        const items = JSON.parse(localStorage.getItem('tasks') || "[ ]");
        this.items = items;
        localStorage.setItem('tasks', JSON.stringify(items));
    }

    getAll() {
        return this.items;
    }

    update(item) {
        localStorage.setItem('tasks', JSON.stringify(this.items));
        return this.items;
    }

}
