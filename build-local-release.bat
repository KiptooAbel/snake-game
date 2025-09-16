@echo off
echo Building Snake Game RELEASE APK locally...
echo.
echo This will build a release APK optimized for distribution
echo ⚠️  WARNING: This uses a debug keystore - DO NOT use for production!
echo For production, you need to generate a proper signing key.
echo.

pause

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

if not exist "%ANDROID_HOME%" (
    echo ERROR: Android SDK not found at %ANDROID_HOME%
    echo Please ensure Android Studio is properly installed.
    pause
    exit /b 1
)

echo ANDROID_HOME is set to: %ANDROID_HOME%
echo.

echo Building release APK...
cd android
gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Release build successful!
    echo APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo ⚠️  IMPORTANT: This APK is signed with a debug key and should NOT be published to Play Store!
    echo For Play Store submission, use EAS Build production profile.
    echo.
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo APK file size: 
        dir "app\build\outputs\apk\release\app-release.apk" | findstr "app-release.apk"
    )
) else (
    echo.
    echo ❌ Release build failed! Check the error messages above.
)

echo.
pause
