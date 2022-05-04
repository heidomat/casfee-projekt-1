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
