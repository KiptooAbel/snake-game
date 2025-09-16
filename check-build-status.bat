@echo off
echo Checking EAS Build Status...
echo.

echo Recent builds:
eas build:list --platform android --limit 5

echo.
echo For real-time build status, visit:
echo https://expo.dev/accounts/abelkiprop/projects/snake-game/builds
echo.

pause
