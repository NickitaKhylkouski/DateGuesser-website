class CustomYearGame extends BaseGame {
    constructor() {
        super('custom-year');
        this.startYearInput = document.getElementById('start-year');
        this.endYearInput = document.getElementById('end-year');
    }

    async generateNewDate() {
        const startYear = this.startYearInput.value;
        const endYear = this.endYearInput.value;
        const response = await fetch(`/api/random_date/${startYear}/${endYear}`);
        const data = await response.json();
        this.currentDate = data;
        this.dateDisplay.textContent = `Date: ${new Date(data.date).toLocaleDateString()}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CustomYearGame();
});
