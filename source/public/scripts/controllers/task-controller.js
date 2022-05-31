import {taskService} from "../services/task-service.js";
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
        this.taskListTemplateCompiled = Handlebars.compile(document.getElementById('tasklist-template').innerHTML);
    }

    handlebarHelpersInit() {

        Handlebars.registerHelper('truncString', function (string) {
            const points = string.length > 150 ? '...' : '';
            const truncateString = string.substring(0, 150) + points;
            return new Handlebars.SafeString(truncateString)
        });

        Handlebars.registerHelper('showImportanceSymbol', function (number, iconHtml) {
            let symbols = ``;
            for (let i = 0; i < number; i++) {
                symbols += iconHtml
            }
            return new Handlebars.SafeString(symbols);
        });

        Handlebars.registerHelper('remainingDays', function (dueDate) {
            const today = new Date();
            const remainingTimestamp = dueDate - today.getTime();
            const remainingDays = Math.ceil(remainingTimestamp / (1000 * 60 * 60 * 24));

            switch (true) {
                case (remainingDays > 1):
                    return `in ${remainingDays} Tagen`

                case (remainingDays === 1):
                    return `in ${remainingDays} Tag`

                case (remainingDays === -1):
                    return `vor ${Math.abs(remainingDays)} Tag`

                case (remainingDays < -1):
                    return `vor ${Math.abs(remainingDays)} Tagen`

                default:
                    return `heute`
            }
        });
    }

    loadTheme() {
        if (taskService.getCookie('theme')) {
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
        this.tasklist.addEventListener("click", (event) => {
            this.tasklistEventHandler(event)
        });


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

    tasklistEventHandler(event) {
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


    renderList(data = taskService.items) {
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
        this.loadTheme();
        this.handlebarHelpersInit();
        this.initEventHandlers();
        taskService.loadData();
        this.renderList();
    }


}
