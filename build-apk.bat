@echo off
echo Building Snake Game APK...
echo.
echo This will build your Snake Game into an APK file using EAS Build
echo The build will be done remotely on Expo's servers
echo.
pause
echo.
echo Starting build process...
eas build --platform android --profile preview
echo.
echo Build process completed!
echo Check the output above for the download URL of your APK
pause
