/*
    Function styleSwitcher (Dark Mode / Color Mode)
 */
function styleToggle() {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
    }
}

document.querySelector('#toggle-style').addEventListener('click', styleToggle);

/* Show Task Form or List */
function toggleView(viewToShow) {
    switch (viewToShow) {
        case "form":
            document.querySelector("#taskform-wrapper").style.display = 'block';
            document.querySelector("#tasklist-wrapper").style.display = 'none';
            break;
        case 'list':
            document.querySelector("#taskform-wrapper").style.display = 'none';
            document.querySelector("#tasklist-wrapper").style.display = 'block';
            break;

        default:
            document.querySelector("#taskform-wrapper").style.display = 'none';
            document.querySelector("#tasklist-wrapper").style.display = 'block';
            break;
    }

}

const viewButtons = document.querySelectorAll('button[data-view]');

viewButtons.forEach(el => el.addEventListener('click', event => {
    toggleView(event.target.getAttribute("data-view"));
}));

/* Save Form Inputs to LocalStorage */

const taskform = document.querySelector("#taskform-form");
const tasklist = document.querySelector("#tasklist");

const taskStorage = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

const showImportanceSymbols = (number) => {
    let symbols = ``;
    for (let i = 0; i < number; i++) {
         symbols += '<i class="fa fa-bolt-lightning"></i>'
    }
    return symbols;
}


const listBuilder = (task) => {
    const taskEntry = document.createElement('div');
    taskEntry.classList.add('tasklist__entry', 'entry');
    taskEntry.innerHTML = `
                    <div class="entry__status">
                        <input type="checkbox" name="entryStatus" id="entry-status-1"/>
                        <label for="entry-status-1">${task.completed}</label>
                    </div>

                    <div class="entry__countdown">
                        <i class="fa-regular fa-calendar"></i>
                        <span class="countdown-text">${task.duedate}</span>
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
};


function Task(taskTitle, taskDescription, taskImportanceInput, taskDueDate, taskCompleted) {
    this.title = taskTitle
    this.description = taskDescription;
    this.importance = taskImportanceInput;
    this.duedate = taskDueDate;
    this.completed = taskCompleted;
}

taskform.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = taskform.elements;
    const taskEntry = new Task(formData.taskTitle.value, formData.taskDescription.value, formData.taskImportanceInput.value, formData.taskDueDate.value, formData.taskCompleted.value);
    taskStorage.push(taskEntry);
    localStorage.setItem("tasks", JSON.stringify(taskStorage));
    listBuilder(taskEntry);
    toggleView('list');
});


taskStorage.forEach((task) => {
    listBuilder(task);
});

/* Sorting Items

const items = [
    {name: "Ananas", price: 3, amount: 5},
    {name: "Shirt", price: 30, amount: 1},
    {name: "Auto", price: 3000, amount: 1},
    {name: "Bread", price: 1.5, amount: 10},
];

const sortType = {
    "string": (a, b) => a > b ? 1 : a < b ? -1 : 0,
    "number": (a, b) => a - b
}

function sortItemsBy(items, sort) {
    const sortFn = sortType[typeof (items[0][sort])];
    return [...items].sort((a, b) => sortFn(a[sort], b[sort]));
}

*/