/*
    Function styleSwitcher (Dark Mode / Color Mode)
 */
function styleToggle () {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
    } else  {
        document.body.classList.add('dark-mode');
    }
};

document.querySelector('#toggle-style').addEventListener('click', styleToggle);

/* Show Task Form */
function toggleView (viewToShow) {
    switch (viewToShow) {
        case 'form':
            document.getElementById("taskform").style.display='block';
            document.getElementById("tasklist-wrapper").style.display='none';
            break;
        case 'list':
            document.getElementById("taskform").style.display='none';
            document.getElementById("tasklist-wrapper").style.display='block';
            break;

        default:
            document.getElementById("taskform").style.display='none';
            document.getElementById("tasklist-wrapper").style.display='block';
            break;
    }

};

const viewButtons = document.querySelectorAll('button[data-view]');

viewButtons.forEach(el => el.addEventListener('click', event => {
    toggleView(event.target.getAttribute("data-view"));
}));



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