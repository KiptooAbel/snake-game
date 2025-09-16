@echo off
echo Building Snake Game APK locally...
echo.
echo This will build your Snake Game into an APK file using local Android development tools
echo Prerequisites:
echo - Android Studio installed
echo - Android SDK configured
echo - Java JDK installed
echo.

echo Checking prerequisites...

REM Set JAVA_HOME to Android Studio's bundled JDK (most compatible)
if exist "C:\Program Files\Android\Android Studio\jbr" (
    set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
    echo Using Android Studio's JDK: %JAVA_HOME%
) else (
    echo Warning: Android Studio JDK not found, using system Java
)

REM Show Java version
"%JAVA_HOME%\bin\java" -version 2>&1
echo.

REM Set ANDROID_HOME to the common location
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%"

if not exist "%ANDROID_HOME%" (
    echo ERROR: Android SDK not found at %ANDROID_HOME%
    echo Please ensure Android Studio is properly installed.
    pause
    exit /b 1
)

echo ANDROID_HOME is set to: %ANDROID_HOME%
echo.

echo Building debug APK...
cd android
gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo APK location: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo You can install this APK on your Android device:
    echo 1. Transfer the APK to your device
    echo 2. Enable "Install from Unknown Sources" in Settings
    echo 3. Tap the APK to install
    echo.
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        echo APK file size: 
        dir "app\build\outputs\apk\debug\app-debug.apk" | findstr "app-debug.apk"
    )
) else (
    echo.
    echo ❌ Build failed! Check the error messages above.
    echo.
    echo Common solutions:
    echo - Ensure Android SDK is properly installed
    echo - Check that ANDROID_HOME is set correctly
    echo - Try running: gradlew.bat clean assembleDebug
)

echo.
pause
