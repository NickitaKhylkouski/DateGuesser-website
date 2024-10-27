from flask import Flask, render_template, jsonify
import random
from datetime import date, timedelta, datetime, timezone

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/api/random_date/<int:year>')
def get_random_date(year):
    start_date = datetime(year, 1, 1, tzinfo=timezone.utc)
    end_date = datetime(year, 12, 31, tzinfo=timezone.utc)
    days_between = (end_date - start_date).days
    random_days = random.randint(0, days_between)
    random_date = start_date + timedelta(days=random_days)
    return jsonify({
        'date': random_date.strftime('%Y-%m-%d'),
        'weekday': random_date.strftime('%A')
    })

@app.route('/api/random_date/<int:start_year>/<int:end_year>')
def get_random_date_range(start_year, end_year):
    start_date = datetime(start_year, 1, 1, tzinfo=timezone.utc)
    end_date = datetime(end_year, 12, 31, tzinfo=timezone.utc)
    days_between = (end_date - start_date).days
    random_days = random.randint(0, days_between)
    random_date = start_date + timedelta(days=random_days)
    return jsonify({
        'date': random_date.strftime('%Y-%m-%d'),
        'weekday': random_date.strftime('%A')
    })

@app.route('/api/random_month')
def get_random_month():
    month = random.randint(1, 12)
    month_date = datetime(2000, month, 1, tzinfo=timezone.utc)
    return jsonify({
        'month': month,
        'month_name': month_date.strftime('%B')
    })