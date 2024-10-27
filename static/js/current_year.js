class CurrentYearGame extends BaseGame {
    constructor() {
        super('current-year');
    }

    async generateNewDate() {
        const currentYear = new Date().getFullYear();
        const response = await fetch(`/api/random_date/${currentYear}`);
        const data = await response.json();
        this.currentDate = data;
        this.dateDisplay.textContent = `Date: ${new Date(data.date).toLocaleDateString()}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CurrentYearGame();
});
