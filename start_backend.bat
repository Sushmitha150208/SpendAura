@echo off
echo ========================================================
echo   Starting SpendAura Django REST Backend API
echo ========================================================
cd "%~dp0backend"
echo Installing backend dependencies...
pip install -r requirements.txt
echo Applying database migrations...
python manage.py migrate
echo Seeding SpendAura template demo data...
python manage.py seed_data
echo Starting Django server on http://localhost:8000...
python manage.py runserver
pause
