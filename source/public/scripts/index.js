/* TODO
    - ID vergeben (Tasks)
    - Task bearbeiten
    - Sorting / Filtering überarbeiten (Sorting when Filter active)
 */


/* Style Switch */
import {StyleController} from './controller/StyleController.js';

const themeSwitch = new StyleController();
themeSwitch.toggleBodyClass('#toggle-style', 'dark-mode');


const viewButtons = document.querySelectorAll('button[data-view]');
const appContent = document.querySelector('.app__content[data-view]');
const taskform = document.querySelector("#taskform-form");
const tasklist = document.querySelector("#tasklist");
const taskStorage = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
const sortButtons = document.querySelectorAll('button[data-sort-by]');
const filterButtons = document.querySelectorAll('button[data-filter]');

/* Change View (Form or List) */
function changeView(view) {
    appContent.dataset.view = view;
}

viewButtons.forEach(el => el.addEventListener('click', event => {
    changeView(event.target.dataset.view);
}));

/* Helper Functions */
const showImportanceSymbols = (number) => {
    let symbols = ``;
    for (let i = 0; i < number; i++) {
        symbols += '<i class="fa fa-bolt-lightning"></i>'
    }
    return symbols;
}

function getStatusText(status) {
    return !status ? 'offen' : 'erledigt'
}

function getStatusChecked(status) {
    return !status ? '' : 'checked'
}

function getCountdownText(dueDate) {
    const today = new Date();
    const tillDate = new Date(dueDate);

    const remainingTimestamp = tillDate.getTime() - today.getTime();
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
}

function renderDueDate(dueDate) {
    if (dueDate !== null) {
        return `<i class="fa-regular fa-calendar"></i>
        <span class="countdown-text">${getCountdownText(dueDate)}</span>`
    }

    return ``

}

/* Render List */

function listBuilder(task) {
    const taskEntry = document.createElement('div');
    task.completed ? taskEntry.classList.add('tasklist__entry', 'entry', 'entry--completed') : taskEntry.classList.add('tasklist__entry', 'entry');
    taskEntry.innerHTML = `
                    <div class="entry__status">
                        <input type="checkbox" name="entryStatus" id="entry-status-1" disabled ${getStatusChecked(task.completed)} />
                        <label for="entry-status-1">${getStatusText(task.completed)}</label>
                    </div>

                    <div class="entry__countdown">
                        ${renderDueDate(task.duedate)}
                    </div>

                    <div class="entry__title">
                        <h3>${task.title}</h3>
                    </div>

                    <div class="entry__description">
                        ${task.description}
                    </div>

                    <div class="entry__importance" data-importance="${task.importance}">
                        ${showImportanceSymbols(task.importance)}
                    </div>

                    <div class="entry__edit">
                        <button type="button" id="edit-task" class="btn btn--action action__edit" title="bearbeiten"
                                data-uid="${task.uid}">
                            <i class="fa fa-pen"></i>
                        </button>
                    </div>
    `;
    tasklist.appendChild(taskEntry);
}

function renderList(data) {
    tasklist.innerHTML = '';
    data.forEach((task) => {
        listBuilder(task);
    });
}

/* Task Constructor */
function Task(taskTitle, taskDescription, taskImportanceInput, taskDueDate, taskCreationDate, taskCompleted) {
    //this.id = taskId,
    this.title = taskTitle,
    this.description = taskDescription,
    this.importance = +(taskImportanceInput),
    this.duedate = taskDueDate,
    this.creationdate = taskCreationDate,
    this.completed = taskCompleted;
}

const createId = function () {


}


/* Create New Task */
taskform.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = taskform.elements;
    const creationDateTS = new Date().getTime();
    const dueDateTS = new Date(formData.taskDueDate.value).getTime();
    const taskEntry = new Task (formData.taskTitle.value, formData.taskDescription.value, formData.taskImportanceInput.value, dueDateTS, creationDateTS, formData.taskCompleted.checked);
    taskStorage.push(taskEntry);
    localStorage.setItem("tasks", JSON.stringify(taskStorage));
    taskform.reset();
    listBuilder(taskEntry);
    changeView('list');
});


/* Sorting List */

const sortType = {
    'number': {
        'asc': (a, b) => a - b,
        'desc': (a, b) => b - a
    },
    'string': {
        'asc': (a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : a.toLowerCase() < b.toLowerCase() ? -1 : 0,
        'desc': (a, b) => b.toLowerCase() > a.toLowerCase() ? 1 : b.toLowerCase() < a.toLowerCase() ? -1 : 0
    }
}

function sortItemsBy(data, sortBy, sortOrder) {
    const sortFn = sortType[typeof (data[0][sortBy])][sortOrder];
    return [...data].sort((a, b) => sortFn(a[sortBy], b[sortBy]));
}


sortButtons.forEach(el => el.addEventListener('click', event => {
        event.preventDefault();

        const sortOrder = event.target.dataset.sortOrder;

        sortButtons.forEach(element => {
            element.dataset.sortOrder = ''
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
                renderList(taskStorage);
                return;

            default:
                event.target.dataset.sortOrder = '';
                renderList(taskStorage);
                return;
        }

        const sortedList = sortItemsBy(taskStorage, event.target.dataset.sortBy, event.target.dataset.sortOrder);
        renderList(sortedList);
    })
)

/* Filter List */

function filterItemsBy(data, filterBy) {
    return data.filter(elem => elem[filterBy] === false);
}

filterButtons.forEach(el => el.addEventListener('click', event => {

    if ( +(event.target.dataset.filterActive) === 0 ) {
        event.target.dataset.filterActive = '1';
        const filteredList = filterItemsBy(taskStorage, event.target.dataset.filter);
        renderList(filteredList);

    } else {
        event.target.dataset.filterActive = '0';
        renderList(taskStorage);
    }


    })
)

/* Show Tasks from LocalStorage */
renderList(taskStorage);
