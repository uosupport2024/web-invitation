@echo off
echo ========================================================
echo Membuka Google Chrome dengan Developer Switch:
echo --autoplay-policy=no-user-gesture-required
echo ========================================================
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required http://localhost:3000
