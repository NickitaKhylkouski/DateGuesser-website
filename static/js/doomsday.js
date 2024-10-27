class DoomsdayGame extends BaseGame {
    constructor() {
        super('doomsday');
        this.startYearInput = document.getElementById('start-year');
        this.endYearInput = document.getElementById('end-year');
    }

    async generateNewDate() {
        const startYear = this.startYearInput.value;
        const endYear = this.endYearInput.value;
        const response = await fetch(`/api/random_date/${startYear}/${endYear}`);
        const data = await response.json();
        this.currentDate = data;
        const year = new Date(data.date).getFullYear();
        this.dateDisplay.textContent = `Year: ${year}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DoomsdayGame();
});
