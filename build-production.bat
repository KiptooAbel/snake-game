@echo off
echo Building Snake Game APK for Production Release...
echo.
echo This will build your Snake Game for Play Store submission
echo The build will be optimized and signed for release
echo.
pause
echo.
echo Starting production build process...
eas build --platform android --profile production

echo.
echo Production build submitted! 
echo This build can be submitted to Google Play Store.
echo.
echo Check status with:
echo eas build:list --platform android --limit 5
echo.
pause
