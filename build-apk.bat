@echo off
echo Building Snake Game APK using EAS Build...
echo.
echo This will build your Snake Game into an APK file using EAS Build
echo The build will be done remotely on Expo's servers
echo You need to be logged in to your Expo account (use: eas login)
echo.
pause
echo.
echo Starting EAS build process...
eas build --platform android --profile preview

echo.
echo Build submitted! You can check the status with:
echo eas build:list --platform android --limit 5
echo.
echo Or visit: https://expo.dev to see build progress
pause
echo.
echo Build process completed!
echo Check the output above for the download URL of your APK
pause
