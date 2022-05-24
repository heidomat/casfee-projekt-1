class StyleController {
    toggleBodyClass(btn, cssClass) {
        document.querySelector(btn).addEventListener('click', () => {
            document.body.classList.toggle(cssClass)
        });
    }
}

export {StyleController};
