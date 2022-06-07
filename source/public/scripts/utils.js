export class Utils {
    static setCookie(cookieName, cookieValue, expiration) {
        const today = new Date();
        today.setTime(today.getTime() + (expiration * 24 * 60 * 60 * 1000));
        const expires = `expires=${today.toUTCString()}`;
        document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
    }

    static getCookie(cookieName) {
        const name = `${cookieName}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    static deleteCookie(cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
