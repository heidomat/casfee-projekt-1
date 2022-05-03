/**
 * StyleToggle
 *
 * class to initialize the style toggler
 *
 */
export default class StyleToggle {

    constructor() {
        this.initialized = false
    }

    static createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        } else {
            var expires = "";
        }

        if(this.dropCookie) {
            document.cookie = name+"="+value+expires+"; path=/";
        }
    }

    static checkCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);

            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    static eraseCookie(name) {
        this.createCookie(name,"",-1);
    }


    static initialize() {
        if (this.initialized) {
            return;
        }

        this.dropCookie = true;
        this.cookieDuration = 30;
        this.cookieName = 'styleToggler';
        this.cookieValue = 'dark-mode';

        this.toggleStyleBtn = document.querySelector('#toggle-style');

        if (this.checkCookie(this.cookieName) != this.cookieValue) {
            this.showBanner();
        }

        $(this.toggleStyleBtn).bind('click', function(event) {
            event.preventDefault();
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
            } else  {
                document.body.classList.add('dark-mode');
            }
        });

        this.initialized = true;

    }

    static destroy() {
        if (!this.initialized) {
            return;
        }

        this.initialized = false;
    }

}
