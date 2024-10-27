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
        this.setupKeyboardShortcuts();
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

    setupKeyboardShortcuts() {
        const weekdayMap = {
            '1': 'Monday',
            '2': 'Tuesday',
            '3': 'Wednesday',
            '4': 'Thursday',
            '5': 'Friday',
            '6': 'Saturday',
            '7': 'Sunday'
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

            // Handle number keys for weekdays
            if (weekdayMap[e.key] && this.startTime !== null) {
                e.preventDefault();
                const weekdayBtn = Array.from(this.weekdayButtons)
                    .find(btn => btn.dataset.day === weekdayMap[e.key]);
                if (weekdayBtn) {
                    this.checkAnswer(weekdayMap[e.key]);
                    weekdayBtn.classList.add('active');
                    setTimeout(() => weekdayBtn.classList.remove('active'), 100);
                }
            }
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
            if (!this.timeLimit) {
                this.timerDisplay.textContent = `Time: ${elapsed.toFixed(2)}s`;
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
        if (!this.currentDate) return;

        const elapsed = (Date.now() - this.guessStartTime) / 1000;
        this.totalTime += elapsed;
        this.totalGuesses++;

        const correct = userGuess === this.currentDate.weekday;
        if (correct) this.correctGuesses++;

        this.logResult(correct, userGuess, elapsed);
        this.updateStats();

        // Reset only the guess timer and generate new date
        this.guessStartTime = Date.now();
        this.generateNewDate();
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

    endGame() {
        this.weekdayButtons.forEach(btn => btn.disabled = true);
        this.startButton.disabled = false;
        const accuracy = (this.correctGuesses / this.totalGuesses) * 100;
        const avgTime = this.totalTime / this.totalGuesses;
        alert(`Game Over!\nTotal Correct: ${this.correctGuesses}\nAccuracy: ${accuracy.toFixed(2)}%\nAverage Time: ${avgTime.toFixed(2)}s`);
        this.startTime = null;
        this.currentDate = null;
    }
}
