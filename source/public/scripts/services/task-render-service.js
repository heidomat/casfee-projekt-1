export class TaskRenderService {
    showImportanceSymbols (number, iconHtml) {
        let symbols = ``;
        for (let i = 0; i < number; i++) {
            symbols += iconHtml
        }
        return symbols;
    }

    truncateString (string = '', limit = 0) {
        const points = string.length > limit ? '...' : '';
        return string.substring(0, limit) + points;
    }

    getStatus(status, use) {

        switch (use) {
            case 'text':
                return !status ? 'offen' : 'erledigt'

            case 'checkbox':
                return !status ? '' : 'checked'

            case 'cssClass':
                return !status ? '' : 'entry--completed'

            default:
                return '';
        }
    }

    getCountdownText(dueDate) {
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
    }
}

export const taskRenderService = new TaskRenderService();
