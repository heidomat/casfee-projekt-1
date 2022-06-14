export class Task {

    constructor(title, creationDate, description = '', importance = 0, dueDate = 0, completed = false) {
        this.title = title;
        this.description = description;
        this.importance = +(importance);
        this.dueDate = dueDate;
        this.creationDate = creationDate;
        this.completed = completed;
    }

}
