class MonthNumberGame {
    constructor() {
        this.container = document.getElementById('month-number');
        this.monthDisplay = this.container.querySelector('#current-month');
        this.timerDisplay = this.container.querySelector('#timer');
        this.startButton = this.container.querySelector('#start-game');
        this.restartButton = this.container.querySelector('#restart-game');
        this.monthButtons = this.container.querySelectorAll('.month-btn');
        this.accuracyDisplay = this.container.querySelector('#accuracy');
        this.avgTimeDisplay = this.container.querySelector('#avg-time');
        this.totalCorrectDisplay = this.container.querySelector('#total-correct');
        this.resultLog = this.container.querySelector('#result-log');

        this.timeLimit = 60;
        this.startTime = null;
        this.guessStartTime = null;
        this.correctGuesses = 0;
        this.totalGuesses = 0;
        this.totalTime = 0;
        this.currentMonth = null;

        this.bindEvents();
        this.setupKeyboardShortcuts();
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.monthButtons.forEach(button => {
            button.addEventListener('click', () => this.checkAnswer(parseInt(button.dataset.month)));
        });
    }

    setupKeyboardShortcuts() {
        const monthMap = {
            '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
            '7': 7, '8': 8, '9': 9, '0': 10, '-': 11, '=': 12
        };

        document.addEventListener('keydown', (e) => {
            // Only process if this tab is active
            if (!this.container.closest('.tab-pane.active')) return;

            // Handle Space for starting game
            if (e.code === 'Space' && !this.startButton.disabled) {
                e.preventDefault();
                this.startGame();
                return;
            }

            // Handle R for restart
            if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.restartGame();
                return;
            }

            // Handle number keys for months
            if (monthMap[e.key] && !this.startButton.disabled) {
                e.preventDefault();
                const monthBtn = Array.from(this.monthButtons)
                    .find(btn => parseInt(btn.dataset.month) === monthMap[e.key]);
                if (monthBtn && !monthBtn.disabled) {
                    this.checkAnswer(monthMap[e.key]);
                    monthBtn.classList.add('active');
                    setTimeout(() => monthBtn.classList.remove('active'), 100);
                }
            }
        });
    }

    async startGame() {
        if (!this.startTime) {
            this.startTime = Date.now();
            this.updateTimer();
            setTimeout(() => this.endGame(), this.timeLimit * 1000);
        }
        this.startButton.disabled = true;
        this.monthButtons.forEach(btn => btn.disabled = false);
        this.guessStartTime = Date.now();
        await this.generateNewMonth();
    }

    async generateNewMonth() {
        const response = await fetch('/api/random_month');
        const data = await response.json();
        this.currentMonth = data;
        this.monthDisplay.textContent = `Month: ${data.month_name}`;
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

    checkAnswer(userGuess) {
        if (!this.startTime) return;

        const elapsed = (Date.now() - this.guessStartTime) / 1000;
        this.totalTime += elapsed;
        this.totalGuesses++;

        const correct = userGuess === this.currentMonth.month;
        if (correct) this.correctGuesses++;

        this.logResult(correct, userGuess, elapsed);
        this.updateStats();
        
        this.guessStartTime = Date.now();
        this.generateNewMonth();
    }

    logResult(correct, userGuess, elapsed) {
        const resultDiv = document.createElement('div');
        resultDiv.className = correct ? 'text-success' : 'text-danger';
        resultDiv.textContent = `${correct ? 'Correct' : 'Incorrect'}: ${this.currentMonth.month_name} is month ${this.currentMonth.month}, you said ${userGuess} (${elapsed.toFixed(2)}s)`;
        this.resultLog.insertBefore(resultDiv, this.resultLog.firstChild);
    }

    updateStats() {
        const accuracy = (this.correctGuesses / this.totalGuesses) * 100;
        const avgTime = this.totalTime / this.totalGuesses;
        this.accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
        this.avgTimeDisplay.textContent = `Avg Time: ${avgTime.toFixed(2)}s`;
        this.totalCorrectDisplay.textContent = `Total Correct: ${this.correctGuesses}`;
    }

    endGame() {
        this.monthButtons.forEach(btn => btn.disabled = true);
        this.startButton.disabled = false;
        alert(`Game Over!\nTotal Correct: ${this.correctGuesses}\nAccuracy: ${((this.correctGuesses / this.totalGuesses) * 100).toFixed(2)}%`);
        this.startTime = null;
    }

    restartGame() {
        this.correctGuesses = 0;
        this.totalGuesses = 0;
        this.totalTime = 0;
        this.startTime = null;
        this.monthDisplay.textContent = 'Month: ----';
        this.timerDisplay.textContent = 'Time left: 60s';
        this.updateStats();
        this.resultLog.innerHTML = '';
        this.monthButtons.forEach(btn => btn.disabled = true);
        this.startButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MonthNumberGame();
});
