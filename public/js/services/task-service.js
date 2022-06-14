import {httpService} from "./http-service.js";

export class TaskService {

    async addTask(task) {
        return httpService.ajax("POST", "/tasks", task);
    }

    async updateTask(id, task) {
        return httpService.ajax("PUT", `/tasks/${id}`, task);
    }

    async deleteTask(id) {
        return httpService.ajax("DELETE", `/tasks/${id}`);
    }

    async getTaskById(id) {
        return httpService.ajax("GET", `/tasks/${id}`);
    }

    async getAll(sortBy, sortOrder, filterBy) {
        return httpService.ajax("GET", `/tasks?sortBy=${sortBy}&sortOrder=${sortOrder}&filterBy=${filterBy}`,);
    }

    /*
    async createId() {
        const allTasks = await this.getAll();
        const itemLength = allTasks.length || 0;
        const newId = (Math.floor(Math.random() * 100000).toString().slice(0, 3) + (itemLength + 1));
        if (await this.getTaskById(newId)) this.createId();
        return newId;
    }
     */

}

export const taskService = new TaskService();


