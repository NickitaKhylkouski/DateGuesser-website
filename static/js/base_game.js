class BaseGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.correctGuesses = 0;
        this.totalGuesses = 0;
        this.totalTime = 0;
        this.startTime = null;
        this.guessStartTime = null;
        this.currentDate = null;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.dateDisplay = this.container.querySelector('.date-display h3');
        this.timerDisplay = this.container.querySelector('#timer');
        this.weekdayButtons = this.container.querySelectorAll('.weekday-btn');
        this.startButton = this.container.querySelector('#start-game');
        this.restartButton = this.container.querySelector('#restart-game');
        this.accuracyDisplay = this.container.querySelector('#accuracy');
        this.avgTimeDisplay = this.container.querySelector('#avg-time');
        this.resultLog = this.container.querySelector('#result-log');
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.weekdayButtons.forEach(button => {
            button.addEventListener('click', () => this.checkAnswer(button.dataset.day));
        });
    }

    startGame() {
        this.startButton.disabled = true;
        this.weekdayButtons.forEach(btn => btn.disabled = false);
        this.startTime = Date.now();
        this.guessStartTime = Date.now();
        this.updateTimer();
        this.generateNewDate();
    }

    updateTimer() {
        if (this.startTime) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.timerDisplay.textContent = `Time: ${elapsed.toFixed(2)}s`;
            if (!this.timeLimit) {
                requestAnimationFrame(() => this.updateTimer());
            } else {
                const remaining = Math.max(0, this.timeLimit - elapsed);
                this.timerDisplay.textContent = `Time left: ${Math.round(remaining)}s`;
                if (remaining > 0) {
                    requestAnimationFrame(() => this.updateTimer());
                } else {
                    this.endGame();
                }
            }
        }
    }

    checkAnswer(userGuess) {
        if (this.startTime === null) return;

        const elapsed = (Date.now() - this.guessStartTime) / 1000;
        this.totalTime += elapsed;
        this.totalGuesses++;

        const correct = userGuess === this.currentDate.weekday;
        if (correct) this.correctGuesses++;

        this.logResult(correct, userGuess, elapsed);
        this.updateStats();
        
        // Reset the guess timer but keep the main timer running
        this.guessStartTime = Date.now();
        
        if (!this.timeLimit) {
            // For non-timed games, reset the main timer for each guess
            this.startTime = Date.now();
            this.updateTimer();
            this.end_round();
        } else {
            // For timed games, continue with the same main timer
            this.generateNewDate();
        }
    }

    updateStats() {
        const accuracy = (this.correctGuesses / this.totalGuesses) * 100;
        const avgTime = this.totalTime / this.totalGuesses;
        this.accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
        this.avgTimeDisplay.textContent = `Avg Time: ${avgTime.toFixed(2)}s`;
    }

    logResult(correct, userGuess, elapsed) {
        const resultDiv = document.createElement('div');
        resultDiv.className = correct ? 'text-success' : 'text-danger';
        resultDiv.textContent = `${correct ? 'Correct' : 'Incorrect'}: ${this.formatDate(this.currentDate.date)} was a ${this.currentDate.weekday}, you said ${userGuess} (${elapsed.toFixed(2)}s)`;
        this.resultLog.insertBefore(resultDiv, this.resultLog.firstChild);
    }

    restartGame() {
        this.correctGuesses = 0;
        this.totalGuesses = 0;
        this.totalTime = 0;
        this.startTime = null;
        this.guessStartTime = null;
        this.currentDate = null;
        this.startButton.disabled = false;
        this.weekdayButtons.forEach(btn => btn.disabled = true);
        this.updateStats();
        this.resultLog.innerHTML = '';
        this.timerDisplay.textContent = this.timeLimit ? `Time left: ${this.timeLimit}s` : 'Time: 0.00s';
        this.dateDisplay.textContent = 'Date: --/--';
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    }

    generateNewDate() {
        // To be implemented by child classes
    }

    end_round() {
        this.startButton.disabled = false;
        this.weekdayButtons.forEach(btn => btn.disabled = true);
        if (!this.timeLimit) {
            this.startTime = null;
            this.guessStartTime = null;
            this.timerDisplay.textContent = 'Time: 0.00s';
        }
    }

    endGame() {
        this.end_round();
        const accuracy = (this.correctGuesses / this.totalGuesses) * 100;
        const avgTime = this.totalTime / this.totalGuesses;
        alert(`Game Over!\nTotal Correct: ${this.correctGuesses}\nAccuracy: ${accuracy.toFixed(2)}%\nAverage Time: ${avgTime.toFixed(2)}s`);
        this.startTime = null;
    }
}