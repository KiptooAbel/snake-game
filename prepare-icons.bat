@echo off
echo ========================================
echo    CHOMPLINE ICON PREPARATION SCRIPT
echo ========================================
echo.
echo This script will help you prepare the icon files for Chompline app.
echo.
echo REQUIRED ACTIONS:
echo.
echo 1. Save the snake character icon image to this directory
echo 2. Create the following icon files using an image editor:
echo.
echo    a) chompline-icon.png (1024x1024) - Main app icon
echo    b) chompline-adaptive-icon.png (1024x1024) - Android adaptive icon
echo    c) chompline-favicon.png (48x48) - Web favicon
echo    d) chompline-splash-icon.png (400x400) - Splash screen icon
echo.
echo 3. The snake character should fit within a 672x672 safe area for the adaptive icon
echo.
echo 4. After creating all icons, run the following commands:
echo    - expo prebuild --clean
echo    - npm run build:local:release (or your preferred build command)
echo.
echo Current directory: %CD%
echo.
echo Press any key to open the assets/images folder...
pause > nul
explorer "%CD%"
echo.
echo After preparing icons, check the following files have been updated:
echo - app.json (app name and icon paths)
echo - package.json (app name)
echo - strings.xml (Android app name)
echo - settings.gradle (project name)
echo - AndroidManifest.xml (scheme name)
echo.
echo All configuration files have been updated for "chompline"!
echo.
pause
