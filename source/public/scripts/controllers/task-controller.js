import {taskService} from "../services/task-service.js";
import {taskRenderService} from "../services/task-render-service.js";
import {Task} from "../services/task.js";

export class TaskController {
    constructor() {
        this.viewButtons = document.querySelectorAll('button[data-view]');
        this.appContent = document.querySelector('.app__content[data-view]');
        this.taskform = document.querySelector("#taskform");
        this.tasklist = document.querySelector("#tasklist");
        this.sortButtons = document.querySelectorAll('button[data-sort-by]');
        this.filterButtons = document.querySelectorAll('button[data-filter]');
        this.styleSwitchBtn = document.querySelector('#toggle-style');
        this.bodyHTML = document.body;
    }

    loadTheme () {
        if (taskService.getCookie('theme') ){
            this.bodyHTML.classList.add('dark-mode');
        }
    }

    initEventHandlers() {

        /* Style Switch */
        this.styleSwitchBtn.addEventListener('click', () => {
            this.bodyHTML.classList.toggle('dark-mode');
            if (this.bodyHTML.classList.contains('dark-mode')) {
                taskService.setCookie('theme', 'dark-mode', 60);
            } else {
                taskService.deleteCookie('theme');
            }
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
        this.tasklist.addEventListener("click", (event) => { this.tasklistEventHandler(event)});



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
                    this.renderList();
                    return;

                default:
                    event.target.dataset.sortOrder = '';
                    this.renderList();
                    return;
            }

            const sortedList = taskService.sortItemsBy(taskService.items, event.target.dataset.sortBy, event.target.dataset.sortOrder);
            this.renderList(sortedList);
        }))

        /* Filter List */
        this.filterButtons.forEach(el => el.addEventListener('click', event => {

            if (+(event.target.dataset.filterActive) === 0) {
                event.target.dataset.filterActive = '1';
                const filteredList = taskService.filterItemsBy(taskService.items, event.target.dataset.filter);
                this.renderList(filteredList);

            } else {
                event.target.dataset.filterActive = '0';
                this.renderList();
            }

        }))

        /* Submit Form */
        this.taskform.addEventListener("submit", (event) => {

            event.preventDefault();

            if (this.taskform.dataset.action === 'edit') {
                /* Edit Task */
                this.editTask();
            } else if (this.taskform.dataset.action === 'new') {
                /* Create New Task */
                this.createNewTask(event);
            }


            if (event.submitter.classList.contains('action__update-overview')) {
                this.changeView('list');
            }

        });

        /* Range/Input */
        this.taskform.querySelectorAll('.js-range-input').forEach(el => el.addEventListener('change', event => {
            if (event.target.nextElementSibling) event.target.nextElementSibling.value = event.target.value;
            if (event.target.previousElementSibling) event.target.previousElementSibling.value = event.target.value;
        }));

    }

    tasklistEventHandler (event) {
        /* Click Edit Button => getTaskById  */
        if (event.target.closest('button').dataset.action === 'edit') {
            const taskId = event.target.closest('button').dataset.id;
            this.changeView('form');
            this.taskform.dataset.action = 'edit';
            this.loadEditForm(taskService.getTaskById(taskId));
        }
    }

    loadEditForm(data) {
        // fill data of existing task in form
        const formData = this.taskform.elements;
        formData.taskId.value = data.id;
        formData.taskCreationDate.value = data.creationDate;
        formData.taskTitle.value = data.title;
        formData.taskDescription.value = data.description;
        formData.taskImportanceRange.value = data.importance;
        formData.taskImportanceInput.value = data.importance;
        if(data.dueDate) formData.taskDueDate.value = new Date(data.dueDate).toISOString().slice(0, 10);
        formData.taskCompleted.checked = data.completed;
    }

    createNewTask (event) {
        const formData = this.taskform.elements;
        const creationDateTS = new Date().getTime(); // timestamp
        const taskId = formData.taskId.value ? formData.taskId.value : taskService.createId();
        const taskEntry = new Task(taskId, formData.taskTitle.value, creationDateTS, formData.taskDescription.value, formData.taskImportanceInput.value, formData.taskDueDate.valueAsNumber, formData.taskCompleted.checked);
        taskService.addTask(taskEntry);
        this.entryBuilder(taskEntry);

        if (event.submitter.classList.contains('action__update')) {
            formData.taskId.value = taskId;
            formData.taskCreationDate.value = creationDateTS;
            this.taskform.dataset.action = 'edit';
        }

    }

    editTask() {
        const formData = this.taskform.elements;
        const taskEntry = new Task(formData.taskId.value, formData.taskTitle.value, +(formData.taskCreationDate.value), formData.taskDescription.value, formData.taskImportanceInput.value, formData.taskDueDate.valueAsNumber, formData.taskCompleted.checked);
        taskService.updateTask(taskEntry);
        this.renderList();
    }

    renderDueDate(dueDate) {
        if (dueDate !== 0) {
            return `<i class="fa-regular fa-calendar"></i>
            <span class="countdown-text">${taskRenderService.getCountdownText(dueDate)}</span>`
        }

        return ``

    }

    entryBuilder(task) {
        const taskEntry = `
            <div class="tasklist__entry entry ${taskRenderService.getStatus(task.completed, 'cssClass')}" data-id="${task.id}">
                    <div class="entry__status">
                        <input type="checkbox" name="entryStatus" id="entry-status-1" disabled ${taskRenderService.getStatus(task.completed, 'checkbox')} />
                        <label for="entry-status-1">${taskRenderService.getStatus(task.completed, 'text')}</label>
                    </div>

                    <div class="entry__countdown">
                        ${this.renderDueDate(task.dueDate)}
                    </div>

                    <div class="entry__title">
                        <h3>${task.title}</h3>
                    </div>

                    <div class="entry__description">
                        ${taskRenderService.truncateString(task.description, 100)}
                    </div>

                    <div class="entry__importance" data-importance="${task.importance}">
                        ${taskRenderService.showImportanceSymbols(task.importance, '<i class="fa fa-bolt-lightning"></i>')}
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


    renderList(data = taskService.items) {
        const items = data || [];
        this.tasklist.innerHTML = '';
        items.forEach((task) => {
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
        this.loadTheme();
        this.initEventHandlers();
        taskService.loadData();
        this.renderList();
    }


}
