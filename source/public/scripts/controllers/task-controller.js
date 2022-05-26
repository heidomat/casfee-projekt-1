import {taskService} from "../services/task-service.js";

export class TaskController {
    constructor() {
        this.taskStorage = taskService.storage.items;
        this.createNewButton = document.querySelector('#new-task');
        this.viewButtons = document.querySelectorAll('button[data-view]');
        this.appContent = document.querySelector('.app__content[data-view]');
        this.taskform = document.querySelector("#taskform");
        this.tasklist = document.querySelector("#tasklist");
        this.sortButtons = document.querySelectorAll('button[data-sort-by]');
        this.filterButtons = document.querySelectorAll('button[data-filter]');
        this.styleSwitchBtn = document.querySelector('#toggle-style');
        this.bodyHTML = document.body;
    }

    initEventHandlers() {
        /* Style Switch */
        this.styleSwitchBtn.addEventListener('click', () => {
            this.bodyHTML.classList.toggle('dark-mode')
        });


        /* Change View (Form or List) */
        this.viewButtons.forEach(el => el.addEventListener('click', event => {
            event.preventDefault();
            const view = event.target.closest('button').dataset.view;
            this.changeView(view);

            if (event.target.closest('button').dataset.action === 'new') {
                this.taskform.dataset.action = 'new';
            }
        }));

        /* Edit Button */
        this.tasklist.addEventListener("click", this.tasklistEventHandler.bind(this));


        /* Sort List */
        this.sortButtons.forEach(el => el.addEventListener('click', event => {
            event.preventDefault();

            const sortOrder = event.target.dataset.sortOrder;

            this.sortButtons.forEach(element => {
                element.dataset.sortOrder = '';
            });

            switch (sortOrder) {
                case '':
                    event.target.dataset.sortOrder = 'asc';
                    break;
                case 'asc':
                    event.target.dataset.sortOrder = 'desc';
                    break;
                case 'desc':
                    event.target.dataset.sortOrder = '';
                    this.renderList(this.taskStorage);
                    return;

                default:
                    event.target.dataset.sortOrder = '';
                    this.renderList(this.taskStorage);
                    return;
            }

            const sortedList = taskService.sortItemsBy(this.taskStorage, event.target.dataset.sortBy, event.target.dataset.sortOrder);
            this.renderList(sortedList);
        }))

        /* Filter List */
        this.filterButtons.forEach(el => el.addEventListener('click', event => {

            if (+(event.target.dataset.filterActive) === 0) {
                event.target.dataset.filterActive = '1';
                const filteredList = taskService.filterItemsBy(this.taskStorage, event.target.dataset.filter);
                this.renderList(filteredList);

            } else {
                event.target.dataset.filterActive = '0';
                this.renderList(this.taskStorage);
            }

        }))


        this.taskform.addEventListener("submit", (event) => {
            event.preventDefault();

            /* Create New Task */

            /* Edit Task */
            //taskService.addTask(this.taskform, event);


            if (event.submitter.classList.contains('action__update-overview')) {
                this.changeView('list');
            }

        });


    }

    tasklistEventHandler (event) {

        /* Click Edit Button => getTaskById  */
        if (event.target.closest('button').dataset.action === 'edit') {
            const taskId = event.target.closest('button').dataset.id;
            this.changeView('form');
            this.taskform.querySelector('input#task-id').value = taskId;
            this.taskform.dataset.action = 'edit';
            const taskData = taskService.getTaskById(taskId);
            this.loadEditForm(taskData);
        }
    }

    loadEditForm(data) {
        // fill data of existing task in form
        const formData = this.taskform.elements;
        for(let [name, value] of formData) {
            alert(`${name} = ${value}`); // key1 = value1, then key2 = value2
        }
    }

    renderDueDate(dueDate) {

        if (dueDate !== 0) {
            return `<i class="fa-regular fa-calendar"></i>
            <span class="countdown-text">${taskService.getCountdownText(dueDate)}</span>`
        }

        return ``

    }

    entryBuilder(task) {
        const taskEntry = `
            <div class="tasklist__entry entry ${taskService.getStatus(task.completed, 'cssClass')}" data-id="${task.id}">
                    <div class="entry__status">
                        <input type="checkbox" name="entryStatus" id="entry-status-1" disabled ${taskService.getStatus(task.completed, 'checkbox')} />
                        <label for="entry-status-1">${taskService.getStatus(task.completed, 'text')}</label>
                    </div>

                    <div class="entry__countdown">
                        ${this.renderDueDate(task.duedate)}
                    </div>

                    <div class="entry__title">
                        <h3>${task.title}</h3>
                    </div>

                    <div class="entry__description">
                        ${task.description}
                    </div>

                    <div class="entry__importance" data-importance="${task.importance}">
                        ${taskService.showImportanceSymbols(task.importance, '<i class="fa fa-bolt-lightning"></i>')}
                    </div>

                    <div class="entry__edit">
                        <button type="button" class="edit-task btn btn--action action__edit" title="bearbeiten"
                                data-id="${task.id}" data-action="edit">
                            <i class="fa fa-pen"></i>
                        </button>
                    </div>
            </div>
    `;
        this.tasklist.insertAdjacentHTML('afterbegin', taskEntry);
    }


    renderList(data) {
        this.tasklist.innerHTML = '';
        data.forEach((task) => {
            this.entryBuilder(task);
        });
    }

    clearForm () {
        this.taskform.reset();
        this.taskform.dataset.action = '';
        this.taskform.querySelector('input#task-id').value = '';
    }

    changeView(view) {
        this.appContent.dataset.view = view;
        this.clearForm();
    }


    initialize() {
        this.renderList(this.taskStorage);
        this.initEventHandlers();
    }


}
