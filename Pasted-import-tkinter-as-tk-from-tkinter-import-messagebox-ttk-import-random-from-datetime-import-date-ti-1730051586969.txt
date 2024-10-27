import tkinter as tk
from tkinter import messagebox, ttk
import random
from datetime import date, timedelta
import time


class WeekdayGuessingGame:
    def __init__(self, master):
        self.master = master
        master.title("Weekday Guessing Game")
        master.geometry("1200x600")

        self.notebook = ttk.Notebook(master)
        self.notebook.pack(expand=1, fill="both")

        self.frames = [ttk.Frame(self.notebook) for _ in range(7)]

        titles = ["Current Year", "Custom Year Range", "Doomsday Game", "Doomsday Explanation",
                  "Date Rush - Current Year", "Date Rush - Custom Range", "Month Number Game"]
        for frame, title in zip(self.frames, titles):
            self.notebook.add(frame, text=title)

        self.current_year_game = CurrentYearGame(self.frames[0])
        self.custom_year_game = CustomYearGame(self.frames[1])
        self.doomsday_game = DoomsdayGame(self.frames[2])
        self.doomsday_explanation = DoomsdayExplanation(self.frames[3])
        self.date_rush_current_year = DateRushCurrentYear(self.frames[4])
        self.date_rush_custom_range = DateRushCustomRange(self.frames[5])
        self.month_number_game = MonthNumberGame(self.frames[6])

        self.notebook.bind("<<NotebookTabChanged>>", self.on_tab_change)

    def on_tab_change(self, event):
        current_tab = self.notebook.index(self.notebook.select())
        games = [self.current_year_game, self.custom_year_game, self.doomsday_game,
                 self.date_rush_current_year, self.date_rush_custom_range, self.month_number_game]
        for i, game in enumerate(games):
            if i != current_tab and hasattr(game, 'restart_game'):
                game.restart_game()


class BaseGame:
    def __init__(self, master):
        self.master = master
        self.random_date = None
        self.start_time = None
        self.guess_start_time = None
        self.correct_guesses = 0
        self.total_guesses = 0
        self.weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        self.buttons = []
        self.time_limit = None
        self.total_time = 0
        self.setup_ui()

    def setup_ui(self):
        self.date_label = tk.Label(self.master, text="", font=("Arial", 16))
        self.date_label.pack(pady=10)

        self.timer_label = tk.Label(self.master, text="Time: 0.00s", font=("Arial", 12))
        self.timer_label.pack()

        button_frame = tk.Frame(self.master)
        button_frame.pack(pady=10)

        for weekday in self.weekdays:
            button = tk.Button(button_frame, text=weekday, command=lambda day=weekday: self.check_answer(day))
            button.pack(side=tk.LEFT, padx=2)
            button.config(state=tk.DISABLED)
            self.buttons.append(button)

        self.start_button = tk.Button(self.master, text="Start Game", command=self.start_game)
        self.start_button.pack(pady=5)

        self.restart_button = tk.Button(self.master, text="Restart Game", command=self.restart_game)
        self.restart_button.pack(pady=5)

        self.score_label = tk.Label(self.master, text="Accuracy: 0.00%", font=("Arial", 12))
        self.score_label.pack()

        self.avg_time_label = tk.Label(self.master, text="Avg Time: 0.00s", font=("Arial", 12))
        self.avg_time_label.pack()

        self.result_display = tk.Text(self.master, height=10, width=50)
        self.result_display.pack(pady=5)
        self.result_display.config(state=tk.DISABLED)

        self.result_display.tag_configure("correct", foreground="green")
        self.result_display.tag_configure("incorrect", foreground="red")

    def generate_random_date(self):
        pass

    def start_game(self):
        self.random_date = self.generate_random_date()
        self.update_date_label()
        self.start_time = time.time()
        self.guess_start_time = time.time()
        self.update_timer()
        self.start_button.config(state=tk.DISABLED)
        for button in self.buttons:
            button.config(state=tk.NORMAL)

    def update_timer(self):
        if self.start_time:
            elapsed_time = time.time() - self.start_time
            if self.time_limit:
                remaining_time = max(self.time_limit - elapsed_time, 0)
                self.timer_label.config(text=f"Time left: {remaining_time:.0f}s")
                if remaining_time > 0:
                    self.master.after(100, self.update_timer)
                else:
                    self.end_game()
            else:
                self.timer_label.config(text=f"Time: {elapsed_time:.2f}s")
                self.master.after(100, self.update_timer)

    def check_answer(self, user_guess):
        if self.start_time is None:
            return

        correct_weekday = self.random_date.strftime("%A")
        self.total_guesses += 1
        elapsed_time = time.time() - self.guess_start_time
        self.total_time += elapsed_time

        if user_guess == correct_weekday:
            self.correct_guesses += 1
            result = f"Correct: {self.random_date.strftime('%m/%d/%Y')} was a {correct_weekday} and took {elapsed_time:.2f}s\n"
            tag = "correct"
        else:
            result = f"Incorrect: {self.random_date.strftime('%m/%d/%Y')} was a {correct_weekday}, you said {user_guess} and took {elapsed_time:.2f}s\n"
            tag = "incorrect"

        self.result_display.config(state=tk.NORMAL)
        self.result_display.insert(tk.END, result, tag)
        self.result_display.see(tk.END)
        self.result_display.config(state=tk.DISABLED)

        self.update_stats()
        if not self.time_limit:
            self.end_round()
        else:
            self.guess_start_time = time.time()
            self.start_game()

    def update_stats(self):
        accuracy = (self.correct_guesses / self.total_guesses) * 100 if self.total_guesses > 0 else 0
        self.score_label.config(text=f"Accuracy: {accuracy:.2f}%")
        avg_time = self.total_time / self.total_guesses if self.total_guesses > 0 else 0
        self.avg_time_label.config(text=f"Avg Time: {avg_time:.2f}s")

    def end_round(self):
        self.start_button.config(state=tk.NORMAL)
        for button in self.buttons:
            button.config(state=tk.DISABLED)
        self.start_time = None
        self.guess_start_time = None
        if not self.time_limit:
            self.timer_label.config(text="Time: 0.00s")

    def end_game(self):
        self.end_round()
        accuracy = (self.correct_guesses / self.total_guesses) * 100 if self.total_guesses > 0 else 0
        avg_time = self.total_time / self.total_guesses if self.total_guesses > 0 else 0
        messagebox.showinfo("Game Over",
                            f"Your final score is {self.correct_guesses}!\n"
                            f"Accuracy: {accuracy:.2f}%\n"
                            f"Total Guesses: {self.total_guesses}\n"
                            f"Average Time: {avg_time:.2f}s")

    def restart_game(self):
        self.correct_guesses = 0
        self.total_guesses = 0
        self.total_time = 0
        self.update_stats()
        self.end_round()
        self.result_display.config(state=tk.NORMAL)
        self.result_display.delete(1.0, tk.END)
        self.result_display.config(state=tk.DISABLED)

    def update_date_label(self):
        pass


class CurrentYearGame(BaseGame):
    def __init__(self, master):
        super().__init__(master)
        self.time_limit = None

    def generate_random_date(self):
        current_year = date.today().year
        start_date = date(current_year, 1, 1)
        end_date = date(current_year, 12, 31)
        time_between_dates = end_date - start_date
        days_between_dates = time_between_dates.days
        random_number_of_days = random.randrange(days_between_dates)
        return start_date + timedelta(days=random_number_of_days)

    def update_date_label(self):
        self.date_label.config(text=f"Date: {self.random_date.strftime('%m/%d')}")


class CustomYearGame(BaseGame):
    def __init__(self, master):
        super().__init__(master)
        self.time_limit = None
        self.setup_year_range()

    def setup_year_range(self):
        self.year_range_frame = tk.Frame(self.master)
        self.year_range_frame.pack(pady=10)

        tk.Label(self.year_range_frame, text="Start Year:").grid(row=0, column=0)
        self.start_year_entry = tk.Entry(self.year_range_frame, width=6)
        self.start_year_entry.grid(row=0, column=1)
        self.start_year_entry.insert(0, "1700")

        tk.Label(self.year_range_frame, text="End Year:").grid(row=0, column=2)
        self.end_year_entry = tk.Entry(self.year_range_frame, width=6)
        self.end_year_entry.grid(row=0, column=3)
        self.end_year_entry.insert(0, "2100")

    def generate_random_date(self):
        start_year = int(self.start_year_entry.get())
        end_year = int(self.end_year_entry.get())
        start_date = date(start_year, 1, 1)
        end_date = date(end_year, 12, 31)
        time_between_dates = end_date - start_date
        days_between_dates = time_between_dates.days
        random_number_of_days = random.randrange(days_between_dates)
        return start_date + timedelta(days=random_number_of_days)

    def update_date_label(self):
        self.date_label.config(text=f"Date: {self.random_date.strftime('%m/%d/%Y')}")


class DoomsdayGame(BaseGame):
    def __init__(self, master):
        super().__init__(master)
        self.time_limit = None
        self.setup_year_range()

    def setup_year_range(self):
        self.year_range_frame = tk.Frame(self.master)
        self.year_range_frame.pack(pady=10)

        tk.Label(self.year_range_frame, text="Start Year:").grid(row=0, column=0)
        self.start_year_entry = tk.Entry(self.year_range_frame, width=6)
        self.start_year_entry.grid(row=0, column=1)
        self.start_year_entry.insert(0, "1700")

        tk.Label(self.year_range_frame, text="End Year:").grid(row=0, column=2)
        self.end_year_entry = tk.Entry(self.year_range_frame, width=6)
        self.end_year_entry.grid(row=0, column=3)
        self.end_year_entry.insert(0, "2100")

    def generate_random_date(self):
        start_year = int(self.start_year_entry.get())
        end_year = int(self.end_year_entry.get())
        year = random.randint(start_year, end_year)
        return date(year, 12, 12)  # Doomsday

    def update_date_label(self):
        self.date_label.config(text=f"Year: {self.random_date.year}")

    def check_answer(self, user_guess):
        if self.start_time is None:
            return

        correct_weekday = self.calculate_doomsday(self.random_date.year)
        self.total_guesses += 1
        elapsed_time = time.time() - self.guess_start_time
        self.total_time += elapsed_time

        if user_guess == correct_weekday:
            self.correct_guesses += 1
            result = f"Correct: Doomsday for {self.random_date.year} was a {correct_weekday} and took {elapsed_time:.2f}s\n"
            tag = "correct"
        else:
            result = f"Incorrect: Doomsday for {self.random_date.year} was a {correct_weekday}, you said {user_guess} and took {elapsed_time:.2f}s\n"
            tag = "incorrect"

        self.result_display.config(state=tk.NORMAL)
        self.result_display.insert(tk.END, result, tag)
        self.result_display.see(tk.END)
        self.result_display.config(state=tk.DISABLED)

        self.update_stats()
        self.end_round()

    def calculate_doomsday(self, year):
        century = year // 100
        year_in_century = year % 100

        # Step 1: Calculate the anchor day for the century
        # 1700s: Sunday (0)
        # 1800s: Friday (5)
        # 1900s: Wednesday (3)
        # 2000s: Tuesday (2)
        anchor_day = (5 * (century % 4) + 2) % 7

        # Step 2: Calculate year's contribution
        # a. Floor division by 12
        # b. Get remainder
        # c. Floor division of remainder by 4
        a = year_in_century // 12
        b = year_in_century % 12
        c = b // 4

        # Step 3: Sum all values and take modulo 7
        doomsday = (a + b + c + anchor_day) % 7

        # Convert to weekday (0 = Sunday, 1 = Monday, etc.)
        return self.weekdays[doomsday]


class DateRushCurrentYear(BaseGame):
    def __init__(self, master):
        super().__init__(master)
        self.time_limit = 60

    def generate_random_date(self):
        current_year = date.today().year
        start_date = date(current_year, 1, 1)
        end_date = date(current_year, 12, 31)
        time_between_dates = end_date - start_date
        days_between_dates = time_between_dates.days
        random_number_of_days = random.randrange(days_between_dates)
        return start_date + timedelta(days=random_number_of_days)

    def update_date_label(self):
        self.date_label.config(text=f"Date: {self.random_date.strftime('%m/%d')}")

    def start_game(self):
        if self.start_time is None:
            self.start_time = time.time()
            self.update_timer()
        self.random_date = self.generate_random_date()
        self.update_date_label()
        self.guess_start_time = time.time()
        for button in self.buttons:
            button.config(state=tk.NORMAL)
        self.start_button.config(state=tk.DISABLED)

    def check_answer(self, user_guess):
        if self.start_time is None:
            return

        correct_weekday = self.random_date.strftime("%A")
        self.total_guesses += 1
        elapsed_time = time.time() - self.guess_start_time
        self.total_time += elapsed_time

        if user_guess == correct_weekday:
            self.correct_guesses += 1
            result = f"Correct: {self.random_date.strftime('%m/%d')} was a {correct_weekday} and took {elapsed_time:.2f}s\n"
            tag = "correct"
        else:
            result = f"Incorrect: {self.random_date.strftime('%m/%d')} was a {correct_weekday}, you said {user_guess} and took {elapsed_time:.2f}s\n"
            tag = "incorrect"

        self.result_display.config(state=tk.NORMAL)
        self.result_display.insert(tk.END, result, tag)
        self.result_display.see(tk.END)
        self.result_display.config(state=tk.DISABLED)

        self.update_stats()
        self.random_date = self.generate_random_date()
        self.update_date_label()
        self.guess_start_time = time.time()

    def end_game(self):
        super().end_game()
        self.start_time = None
class DateRushCustomRange(BaseGame):
    def __init__(self, master):
        super().__init__(master)
        self.time_limit = 60
        self.setup_year_range()

    def setup_year_range(self):
        self.year_range_frame = tk.Frame(self.master)
        self.year_range_frame.pack(pady=10)

        tk.Label(self.year_range_frame, text="Start Year:").grid(row=0, column=0)
        self.start_year_entry = tk.Entry(self.year_range_frame, width=6)
        self.start_year_entry.grid(row=0, column=1)
        self.start_year_entry.insert(0, "1700")

        tk.Label(self.year_range_frame, text="End Year:").grid(row=0, column=2)
        self.end_year_entry = tk.Entry(self.year_range_frame, width=6)
        self.end_year_entry.grid(row=0, column=3)
        self.end_year_entry.insert(0, "2100")

    def generate_random_date(self):
        start_year = int(self.start_year_entry.get())
        end_year = int(self.end_year_entry.get())
        start_date = date(start_year, 1, 1)
        end_date = date(end_year, 12, 31)
        time_between_dates = end_date - start_date
        days_between_dates = time_between_dates.days
        random_number_of_days = random.randrange(days_between_dates)
        return start_date + timedelta(days=random_number_of_days)

    def update_date_label(self):
        self.date_label.config(text=f"Date: {self.random_date.strftime('%m/%d/%Y')}")

    def start_game(self):
        if self.start_time is None:
            self.start_time = time.time()
            self.update_timer()
        self.random_date = self.generate_random_date()
        self.update_date_label()
        self.guess_start_time = time.time()
        for button in self.buttons:
            button.config(state=tk.NORMAL)
        self.start_button.config(state=tk.DISABLED)

    def check_answer(self, user_guess):
        if self.start_time is None:
            return

        correct_weekday = self.random_date.strftime("%A")
        self.total_guesses += 1
        elapsed_time = time.time() - self.guess_start_time
        self.total_time += elapsed_time

        if user_guess == correct_weekday:
            self.correct_guesses += 1
            result = f"Correct: {self.random_date.strftime('%m/%d/%Y')} was a {correct_weekday} and took {elapsed_time:.2f}s\n"
            tag = "correct"
        else:
            result = f"Incorrect: {self.random_date.strftime('%m/%d/%Y')} was a {correct_weekday}, you said {user_guess} and took {elapsed_time:.2f}s\n"
            tag = "incorrect"

        self.result_display.config(state=tk.NORMAL)
        self.result_display.insert(tk.END, result, tag)
        self.result_display.see(tk.END)
        self.result_display.config(state=tk.DISABLED)

        self.update_stats()
        self.random_date = self.generate_random_date()
        self.update_date_label()
        self.guess_start_time = time.time()

    def end_game(self):
        super().end_game()
        self.start_time = None


class MonthNumberGame:
    def __init__(self, master):
        self.master = master
        self.random_month = None
        self.previous_month = None  # To store the previous month
        self.start_time = None
        self.guess_start_time = None
        self.correct_guesses = 0
        self.total_guesses = 0
        self.time_limit = 60
        self.total_time = 0
        self.setup_ui()

    def setup_ui(self):
        self.month_label = tk.Label(self.master, text="", font=("Arial", 16))
        self.month_label.pack(pady=10)

        self.timer_label = tk.Label(self.master, text="Time left: 60s", font=("Arial", 12))
        self.timer_label.pack()

        button_frame = tk.Frame(self.master)
        button_frame.pack(pady=10)

        self.buttons = []
        for i in range(1, 13):
            button = tk.Button(button_frame, text=str(i), command=lambda num=i: self.check_answer(num))
            button.grid(row=(i - 1) // 4, column=(i - 1) % 4, padx=2, pady=2)
            button.config(state=tk.DISABLED)
            self.buttons.append(button)

        self.start_button = tk.Button(self.master, text="Start Game", command=self.start_game)
        self.start_button.pack(pady=5)

        self.restart_button = tk.Button(self.master, text="Restart Game", command=self.restart_game)
        self.restart_button.pack(pady=5)

        self.score_label = tk.Label(self.master, text="Accuracy: 0.00%", font=("Arial", 12))
        self.score_label.pack()

        self.total_guesses_label = tk.Label(self.master, text="Total Guesses: 0", font=("Arial", 12))
        self.total_guesses_label.pack()

        self.avg_time_label = tk.Label(self.master, text="Avg Time: 0.00s", font=("Arial", 12))
        self.avg_time_label.pack()

        self.result_display = tk.Text(self.master, height=10, width=50)
        self.result_display.pack(pady=5)
        self.result_display.config(state=tk.DISABLED)

        self.result_display.tag_configure("correct", foreground="green")
        self.result_display.tag_configure("incorrect", foreground="red")

    def generate_random_month(self):
        # Generate a random month, ensuring it's not the same as the previous one
        while True:
            month = random.randint(1, 12)
            if month != self.previous_month:
                self.previous_month = month
                return month

    def start_game(self):
        if self.start_time is None:
            self.start_time = time.time()
            self.update_timer()
        self.random_month = self.generate_random_month()
        self.update_month_label()
        self.guess_start_time = time.time()
        for button in self.buttons:
            button.config(state=tk.NORMAL)
        self.start_button.config(state=tk.DISABLED)

    def update_timer(self):
        if self.start_time:
            elapsed_time = time.time() - self.start_time
            remaining_time = max(self.time_limit - elapsed_time, 0)
            self.timer_label.config(text=f"Time left: {remaining_time:.0f}s")
            if remaining_time > 0:
                self.master.after(100, self.update_timer)
            else:
                self.end_game()

    def update_month_label(self):
        month_name = date(2000, self.random_month, 1).strftime("%B")
        self.month_label.config(text=f"Month: {month_name}")

    def check_answer(self, user_guess):
        if self.start_time is None:
            return

        self.total_guesses += 1
        elapsed_time = time.time() - self.guess_start_time
        self.total_time += elapsed_time

        if user_guess == self.random_month:
            self.correct_guesses += 1
            result = f"Correct: {date(2000, self.random_month, 1).strftime('%B')} is month number {self.random_month} and took {elapsed_time:.2f}s\n"
            tag = "correct"
        else:
            result = f"Incorrect: {date(2000, self.random_month, 1).strftime('%B')} is month number {self.random_month}, you said {user_guess} and took {elapsed_time:.2f}s\n"
            tag = "incorrect"

        self.result_display.config(state=tk.NORMAL)
        self.result_display.insert(tk.END, result, tag)
        self.result_display.see(tk.END)
        self.result_display.config(state=tk.DISABLED)

        self.update_stats()
        self.random_month = self.generate_random_month()
        self.update_month_label()
        self.guess_start_time = time.time()

    def update_stats(self):
        accuracy = (self.correct_guesses / self.total_guesses) * 100 if self.total_guesses > 0 else 0
        self.score_label.config(text=f"Accuracy: {accuracy:.2f}%")
        self.total_guesses_label.config(text=f"Total Guesses: {self.total_guesses}")
        avg_time = self.total_time / self.total_guesses if self.total_guesses > 0 else 0
        self.avg_time_label.config(text=f"Avg Time: {avg_time:.2f}s")

    def end_game(self):
        for button in self.buttons:
            button.config(state=tk.DISABLED)
        self.start_button.config(state=tk.NORMAL)
        accuracy = (self.correct_guesses / self.total_guesses) * 100 if self.total_guesses > 0 else 0
        avg_time = self.total_time / self.total_guesses if self.total_guesses > 0 else 0
        messagebox.showinfo("Game Over",
                            f"Your final score is {self.correct_guesses}!\n"
                            f"Accuracy: {accuracy:.2f}%\n"
                            f"Total Guesses: {self.total_guesses}\n"
                            f"Average Time: {avg_time:.2f}s")
        self.start_time = None

    def restart_game(self):
        self.correct_guesses = 0
        self.total_guesses = 0
        self.total_time = 0
        self.start_time = None
        self.previous_month = None  # Reset the previous month
        self.update_stats()
        self.timer_label.config(text="Time left: 60s")
        self.result_display.config(state=tk.NORMAL)
        self.result_display.delete(1.0, tk.END)
        self.result_display.config(state=tk.DISABLED)
        for button in self.buttons:
            button.config(state=tk.DISABLED)
        self.start_button.config(state=tk.NORMAL)


class DoomsdayExplanation:
    def __init__(self, master):
        self.master = master

        # Create a scrollable text widget
        self.text_widget = tk.Text(master, wrap=tk.WORD, width=60, height=20)
        self.text_widget.pack(expand=True, fill=tk.BOTH, padx=10, pady=10)

        # Create a scrollbar
        scrollbar = tk.Scrollbar(master, command=self.text_widget.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.text_widget.config(yscrollcommand=scrollbar.set)

        # Make the text widget read-only
        self.text_widget.config(state=tk.NORMAL)
        self.add_explanation()
        self.text_widget.config(state=tk.DISABLED)

    def add_explanation(self):
        explanation = """
Doomsday Algorithm Explanation and Tips

The Doomsday algorithm is a method for determining the day of the week for any date. It's based on the fact that certain easy-to-remember dates always fall on the same day of the week within a year. This day is called the "Doomsday".

How it works:
1. Memorize the anchor days for each century:
   - 1700s: Sunday
   - 1800s: Friday
   - 1900s: Wednesday
   - 2000s: Tuesday

2. Calculate the year's Doomsday:
   a. Take the last two digits of the year.
   b. Divide by 12 and remember the quotient and remainder.
   c. Add the quotient and remainder.
   d. Add the century's anchor day.
   e. The result modulo 7 is the Doomsday for that year.

3. Use the year's Doomsday to find the day for any date:
   Remember these Doomsday dates:
   - 4/4, 6/6, 8/8, 10/10, 12/12
   - 5/9, 9/5, 7/11, 11/7
   - The last day of February
   - For leap years: 1/11 and 2/22; otherwise: 1/10 and 2/21

Tips to improve your speed:
1. Memorize days of the week as numbers:
   Sunday = 0, Monday = 1, ..., Saturday = 6

2. Use the "odd + 11" rule for odd months:
   Add 11 to the previous even month's Doomsday date.
   E.g., If 4/4 is a Doomsday, then 5/9 is also a Doomsday.

3. The 28, 56, 84 rule:
These dates always fall on the same day of the week within a year.

4. Practice mental arithmetic:
   Quickly performing modulo 7 calculations is crucial.

5. Use nearest Doomsday:
   Find the closest Doomsday to your target date and count the difference.

Remember, practice makes perfect. The more you use the Doomsday algorithm, the faster you'll become!
"""
        self.text_widget.insert(tk.END, explanation)


if __name__ == "__main__":
    root = tk.Tk()
    game = WeekdayGuessingGame(root)
    root.mainloop()
