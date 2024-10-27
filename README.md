# Weekday Guessing Game

A web-based mental calculation game that helps users master the art of determining weekdays for any given date through various engaging game modes.

## Purpose and Educational Value

This game is designed to help users develop and improve their mental date calculation skills. Through regular practice and progressively challenging game modes, players can learn to quickly determine the day of the week for any date, enhancing both their mental arithmetic abilities and understanding of calendar patterns.

## Features

### Game Modes
- **Current Year Game**: Practice with dates from the current year
- **Custom Year Range**: Challenge yourself with dates from 1700 to 2100
- **Doomsday Algorithm Game**: Master the famous calendar calculation method
- **Date Rush**: Test your speed with rapid-fire calculations
- **Month Number Game**: Practice quick month-to-number conversions

### Additional Features
- 🎮 Keyboard shortcuts for quick inputs
- 📊 Real-time performance tracking
- ⏱️ Timer modes for speed challenges
- 📈 Accuracy and speed statistics
- 💡 Comprehensive learning resources

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: Vanilla JavaScript
- **Styling**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Theme**: Dark mode optimized

## Installation & Setup

### Requirements

```plaintext
- Python 3.8 or higher
- Flask
- Modern web browser with JavaScript enabled
```

### Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install flask
   ```
3. Start the server:
   ```bash
   python main.py
   ```
4. Open your browser and navigate to `http://localhost:5000`

## Game Modes in Detail

### Current Year Game
- Focus on dates within the current year
- Perfect for beginners
- Month/day display only
- Unlimited time per guess

### Custom Year Range Game
- Practice with dates from any year (1700-2100)
- Adjustable year range
- Great for century calculation practice
- Full date display

### Doomsday Algorithm Game
- Dedicated mode for learning Conway's Doomsday Algorithm
- Century anchors practice
- Pattern recognition training
- Detailed feedback

### Date Rush
- 60-second time limit
- Rapid-fire date calculations
- Available in both current year and custom range
- Score tracking for speed and accuracy

### Month Number Game
- Quick month name to number conversion
- 60-second challenge mode
- Perfect for building fundamental skills
- Keyboard optimized input

## Keyboard Controls

### Game Controls
- `Space` - Start game
- `R` - Restart game

### Answer Keys
- `1-7` - Select weekday (Monday through Sunday)
- `1-9,0,-,=` - Select month (January through December)

## Learning Resources

### Doomsday Algorithm Quick Reference

The Doomsday Algorithm uses anchor days and patterns to quickly determine weekdays:

#### Century Anchors
- 1700s: Sunday (0)
- 1800s: Friday (5)
- 1900s: Wednesday (3)
- 2000s: Tuesday (2)

#### Key Dates (Doomsdays)
- 4/4, 6/6, 8/8, 10/10, 12/12
- 5/9, 9/5, 7/11, 11/7
- Last day of February
- Leap years: 1/11, 2/22
- Non-leap years: 1/10, 2/21

### Tips for Improving Speed

1. **Practice Fundamentals**
   - Master month numbers first
   - Learn century anchors by heart
   - Memorize key doomsday dates

2. **Mental Math Shortcuts**
   - Use the "odd + 11" rule for odd months
   - Practice modulo 7 calculations
   - Learn to count days efficiently

3. **Progressive Learning**
   - Start with the current year
   - Add century calculations gradually
   - Challenge yourself with time limits
   - Focus on accuracy before speed

4. **Regular Practice**
   - Set daily practice goals
   - Track your progress
   - Gradually increase difficulty
   - Use keyboard shortcuts for faster input

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

