@echo off
echo Snake Game - Local Build Status
echo =================================
echo.

echo Checking for APK files...
echo.

echo DEBUG APK:
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo ✅ Found: android\app\build\outputs\apk\debug\app-debug.apk
    dir "android\app\build\outputs\apk\debug\app-debug.apk" | findstr "app-debug.apk"
) else (
    echo ❌ Not found: android\app\build\outputs\apk\debug\app-debug.apk
)

echo.
echo RELEASE APK:
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo ✅ Found: android\app\build\outputs\apk\release\app-release.apk
    dir "android\app\build\outputs\apk\release\app-release.apk" | findstr "app-release.apk"
) else (
    echo ❌ Not found: android\app\build\outputs\apk\release\app-release.apk
)

echo.
echo To install APK on your Android device:
echo 1. Enable Developer Options and USB Debugging
echo 2. Connect device via USB
echo 3. Run: adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Or transfer the APK file to your device and install manually
echo.

pause
