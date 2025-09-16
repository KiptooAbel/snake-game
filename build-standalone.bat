@echo off
echo Building Snake Game STANDALONE APK locally...
echo.
echo This will create a standalone APK that doesn't need a development server
echo.

REM Set JAVA_HOME to Android Studio's bundled JDK (most compatible)
if exist "C:\Program Files\Android\Android Studio\jbr" (
    set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
    echo Using Android Studio's JDK: %JAVA_HOME%
) else (
    echo Warning: Android Studio JDK not found, using system Java
)

REM Set ANDROID_HOME to the common location
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%"

REM Set NODE_ENV for production bundle
set "NODE_ENV=production"

if not exist "%ANDROID_HOME%" (
    echo ERROR: Android SDK not found at %ANDROID_HOME%
    echo Please ensure Android Studio is properly installed.
    pause
    exit /b 1
)

echo ANDROID_HOME is set to: %ANDROID_HOME%
echo NODE_ENV is set to: %NODE_ENV%
echo.

echo Step 1: Creating JavaScript bundle...
npx expo export:embed --platform android --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

echo.
echo Step 2: Building standalone release APK...
cd android
gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Standalone APK build successful!
    echo APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo This APK is completely standalone and ready to install on any Android device!
    echo It does NOT require a development server.
    echo.
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo APK file size: 
        dir "app\build\outputs\apk\release\app-release.apk" | findstr "app-release.apk"
    )
) else (
    echo.
    echo ❌ Standalone build failed! Check the error messages above.
)

echo.
pause
