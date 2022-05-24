class Task {
    constructor(taskTitle, taskDescription, taskImportanceInput, taskDueDate, taskCompleted) {
        this.title = taskTitle
        this.description = taskDescription;
        this.importance = taskImportanceInput;
        this.duedate = taskDueDate;
        this.creationDate = taskCreationDate;
        this.completed = taskCompleted;
    }
}

export {Task};

