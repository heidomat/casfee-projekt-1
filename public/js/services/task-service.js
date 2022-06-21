/* eslint class-methods-use-this:0 */
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

}

export const taskService = new TaskService();


