export function handlebarsHelper() {
    Handlebars.registerHelper('truncString', (string) => {
        const str = string ? string : '';
        const points = str.length > 150 ? '...' : '';
        const truncateString = str.substring(0, 150) + points;
        return new Handlebars.SafeString(truncateString)
    });

    Handlebars.registerHelper('showImportanceSymbol', (number, iconHtml) => {
        let symbols = ``;
        for (let i = 0; i < number; i++) {
            symbols += iconHtml
        }
        return new Handlebars.SafeString(symbols);
    });

    Handlebars.registerHelper('remainingDays', (dueDate) => {
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
