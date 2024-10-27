from flask import Flask, render_template, jsonify
import random
from datetime import date, timedelta, datetime
from zoneinfo import ZoneInfo

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/api/random_date/<int:year>')
def get_random_date(year):
    # Use local time (EST) instead of UTC
    local_tz = ZoneInfo("America/New_York")
    start_date = datetime(year, 1, 1, tzinfo=local_tz)
    end_date = datetime(year, 12, 31, tzinfo=local_tz)
    days_between = (end_date - start_date).days
    random_days = random.randint(0, days_between)
    random_date = start_date + timedelta(days=random_days)
    # Return date in local time
    return jsonify({
        'date': random_date.strftime('%Y-%m-%d'),
        'weekday': random_date.strftime('%A')
    })

@app.route('/api/random_date/<int:start_year>/<int:end_year>')
def get_random_date_range(start_year, end_year):
    local_tz = ZoneInfo("America/New_York")
    start_date = datetime(start_year, 1, 1, tzinfo=local_tz)
    end_date = datetime(end_year, 12, 31, tzinfo=local_tz)
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
    local_tz = ZoneInfo("America/New_York")
    month_date = datetime(2000, month, 1, tzinfo=local_tz)
    return jsonify({
        'month': month,
        'month_name': month_date.strftime('%B')
    })
