export class Task {

    constructor(id, title, creationDate, description = '', importance = 0, dueDate = 0, completed = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.importance = +(importance);
        this.dueDate = dueDate;
        this.creationDate = creationDate;
        this.completed = completed;
    }

    toJSON() {
        return {
            id : this.id,
            title : this.title,
            description : this.description,
            importance : this.importance,
            dueDate : this.dueDate,
            creationDate : this.creationDate,
            completed : this.completed
        };
    }

}
