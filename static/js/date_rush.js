class DateRushGame extends BaseGame {
    constructor() {
        super('date-rush');
        this.timeLimit = 60;
        this.totalCorrect = this.container.querySelector('#total-correct');
    }

    startGame() {
        super.startGame();
        setTimeout(() => this.endGame(), this.timeLimit * 1000);
    }

    updateTimer() {
        if (this.startTime) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            const remaining = Math.max(0, this.timeLimit - elapsed);
            this.timerDisplay.textContent = `Time left: ${Math.round(remaining)}s`;
            if (remaining > 0) {
                requestAnimationFrame(() => this.updateTimer());
            }
        }
    }

    async generateNewDate() {
        const response = await fetch('/api/random_date/2024');  // Current year
        const data = await response.json();
        this.currentDate = data;
        const date = new Date(data.date);
        this.dateDisplay.textContent = `Date: ${date.getMonth() + 1}/${date.getDate()}`;
    }

    updateStats() {
        super.updateStats();
        this.totalCorrect.textContent = `Total Correct: ${this.correctGuesses}`;
    }

    endGame() {
        super.endGame();
        alert(`Game Over!\nTotal Correct: ${this.correctGuesses}\nAccuracy: ${((this.correctGuesses / this.totalGuesses) * 100).toFixed(2)}%`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DateRushGame();
});
