import {Utils} from "../utils.js";
import {Task} from "../services/task.js";
import {taskService} from "../services/task-service.js";
import {initHandlebarHelpers} from "./handlebars-helper.js";

export class TaskController {

    constructor() {
        this.viewButtons = document.querySelectorAll('button[data-view]');
        this.sortButtons = document.querySelectorAll('button[data-sort-by]');
        this.filterButtons = document.querySelectorAll('button[data-filter]');
        this.appContent = document.querySelector('.app__content[data-view]');
        this.taskform = document.querySelector("#taskform");
        this.tasklist = document.querySelector("#tasklist");
        this.styleSwitchBtn = document.querySelector('#toggle-style');
        this.bodyHTML = document.body;

        this.sortByDefaults = 'creationDate';
        this.sortOrderDefaults = 'asc';
        this.filterByDefaults = '';

        this.sortBy = this.sortByDefaults;
        this.sortOrder = this.sortOrderDefaults;
        this.filterBy = this.filterByDefaults;

        // eslint-disable-next-line no-undef
        this.taskListTemplateCompiled = Handlebars.compile(document.getElementById('tasklist-template').innerHTML);
    }

    loadTheme() {
        if (Utils.getCookie('theme')) {
            this.bodyHTML.classList.add('dark-mode');
        }
    }

    initEventHandlers() {

        /* Style Switch */
        this.styleSwitchBtn.addEventListener('click', () => {
            this.bodyHTML.classList.toggle('dark-mode');
            if (this.bodyHTML.classList.contains('dark-mode')) {
                Utils.setCookie('theme', 'dark-mode', 60);
            } else {
                Utils.deleteCookie('theme');
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
        this.tasklist.addEventListener("click", (event) => {
            const editButton = event.target.closest('button[data-action="edit"]');
            if (editButton) {
                const taskId = editButton.dataset.id;
                this.changeView('form');
                this.taskform.dataset.action = 'edit';
                this.loadEditForm(taskService.getTaskById(taskId));
            }
        });


        /* Sort List */
        this.sortButtons.forEach(el => el.addEventListener('click', event => {
            const e = event;

            e.preventDefault();

            const sortButton = event.target.closest('button');
            const sortOrder = sortButton.dataset.sortOrder;


            this.sortButtons.forEach(element => {
                // eslint-disable-next-line no-param-reassign
                element.dataset.sortOrder = '';
            });

            switch (sortOrder) {
                case '':
                    sortButton.dataset.sortOrder = 'asc';
                    this.sortBy = sortButton.dataset.sortBy;
                    this.sortOrder = 'asc';
                    this.renderList();

                    break;
                case 'asc':
                    sortButton.dataset.sortOrder = 'desc';
                    this.sortBy = sortButton.dataset.sortBy;
                    this.sortOrder = 'desc';
                    this.renderList();
                    break;

                default:
                    this.sortBy = this.sortByDefaults;
                    this.sortOrder = this.sortOrderDefaults;
                    this.renderList();
                    e.target.dataset.sortOrder = '';
                    break;
            }
        }))

        /* Filter List */
        this.filterButtons.forEach(el => el.addEventListener('click', e => {

            const event = e;

            if (+(event.target.dataset.filterActive) === 0) {
                event.target.dataset.filterActive = '1';
                this.filterBy = event.target.dataset.filter;
                this.renderList();
            } else {
                event.target.dataset.filterActive = '0';
                this.filterBy = '';
                this.renderList();
            }

        }))

        /* Submit Form */
        this.taskform.addEventListener("submit", (event) => {

            event.preventDefault();

            if (this.taskform.dataset.action === 'edit') {
                this.editTask();
            } else if (this.taskform.dataset.action === 'new') {
                this.createNewTask(event);
            }

            if (event.submitter.classList.contains('action__update-overview')) {
                this.changeView('list');
            }


        });

        /* Range/Input */
        this.taskform.querySelectorAll('.js-range-input').forEach(el => el.addEventListener('change', e => {
            const event = e;
            if (event.target.nextElementSibling) event.target.nextElementSibling.value = event.target.value;
            if (event.target.previousElementSibling) event.target.previousElementSibling.value = event.target.value;
        }));

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
        if (data.dueDate) formData.taskDueDate.value = new Date(data.dueDate).toISOString().slice(0, 10);
        formData.taskCompleted.checked = data.completed;
    }

    createNewTask(event) {
        const formData = this.taskform.elements;
        const creationDateTS = new Date().getTime(); // timestamp
        const taskId = formData.taskId.value ? formData.taskId.value : taskService.createId();
        const taskEntry = new Task(taskId, formData.taskTitle.value, creationDateTS, formData.taskDescription.value, formData.taskImportanceInput.value, formData.taskDueDate.valueAsNumber, formData.taskCompleted.checked);
        taskService.addTask(taskEntry);
        this.renderList();

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


    renderList() {
        const data = taskService.getNote(this.sortBy, this.sortOrder, this.filterBy);
        this.tasklist.innerHTML = this.taskListTemplateCompiled(data);
    }

    clearForm() {
        this.taskform.reset();
        this.taskform.dataset.action = '';
        this.taskform.querySelector('input#task-id').value = '';
    }

    changeView(view) {
        this.appContent.dataset.view = view;
        this.clearForm();
    }

    initialize() {
        taskService.loadData();
        this.loadTheme();
        initHandlebarHelpers();
        this.initEventHandlers();
        this.renderList();
    }


}
