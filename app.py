from flask import Flask, render_template, jsonify
import random
from datetime import date, timedelta, datetime

app = Flask(__name__)

# List of weekday names starting from Monday (0) to Sunday (6)
WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/api/random_date/<int:year>')
def get_random_date(year):
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    days_between = (end_date - start_date).days
    random_days = random.randint(0, days_between)
    random_date = start_date + timedelta(days=random_days)
    return jsonify({
        'date': random_date.strftime('%Y-%m-%d'),
        'weekday': WEEKDAYS[random_date.weekday()]
    })

@app.route('/api/random_date/<int:start_year>/<int:end_year>')
def get_random_date_range(start_year, end_year):
    start_date = date(start_year, 1, 1)
    end_date = date(end_year, 12, 31)
    days_between = (end_date - start_date).days
    random_days = random.randint(0, days_between)
    random_date = start_date + timedelta(days=random_days)
    return jsonify({
        'date': random_date.strftime('%Y-%m-%d'),
        'weekday': WEEKDAYS[random_date.weekday()]
    })

@app.route('/api/random_month')
def get_random_month():
    month = random.randint(1, 12)
    month_date = date(2000, month, 1)
    return jsonify({
        'month': month,
        'month_name': month_date.strftime('%B')
    })
