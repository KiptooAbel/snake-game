# Snake Game APK Build Guide

This guide shows you how to build an APK for your Snake Game both locally and using EAS Build.

## 🚀 EAS Build (Recommended - Remote Build)

EAS Build is Expo's cloud-based build service that handles all the complexity for you.

### Prerequisites
- Expo CLI installed: `npm install -g @expo/cli`
- EAS CLI installed: `npm install -g eas-cli`
- Expo account (sign up at https://expo.dev)

### Steps
1. **Login to Expo**:
   ```bash
   eas login
   ```

2. **Build APK using the batch file**:
   ```bash
   build-apk.bat
   ```
   
   Or manually:
   ```bash
   eas build --platform android --profile preview
   ```

3. **Check build status**:
   ```bash
   eas build:list --platform android --limit 5
   ```

4. **Download your APK**:
   - Visit https://expo.dev
   - Navigate to your project
   - Download the APK from the successful build

### Build Profiles Available
- `preview`: Builds APK for testing (faster)
- `production`: Builds APK optimized for release
- `development`: Builds development client

## 🔧 Local Build (Advanced)

Since you have Android Studio installed, you can build APKs locally for faster iteration.

### Prerequisites ✅ (You have these)
- Android Studio installed ✅
- Android SDK configured ✅
- Java JDK 11+ installed ✅

### Quick Local Build
Use the batch files I've created:

1. **Debug APK** (for testing):
   ```bash
   build-local.bat
   ```

2. **Release APK** (optimized, but still debug-signed):
   ```bash
   build-local-release.bat
   ```

3. **Check APK status**:
   ```bash
   check-local-apk.bat
   ```

### Manual Local Build
Or use npm scripts:
```bash
# Build debug APK locally
npm run build:local:debug

# Build release APK locally  
npm run build:local:release
```

### APK Locations
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

### Installing Your APK

#### Method 1: ADB (Recommended)
```bash
# Enable ADB in environment
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%PATH%

# Connect device and install
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### Method 2: Manual Transfer
1. Copy APK to your Android device
2. Enable "Install from Unknown Sources" in device settings
3. Tap the APK file to install

## 📱 Installing the APK

1. **Enable Developer Options** on your Android device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"

2. **Install via ADB**:
   ```bash
   adb install path/to/your/app.apk
   ```

3. **Or transfer APK to device and install manually**

## 🛠️ Build Configuration

Your current build configuration in `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build fails with "credentials" error**:
   - Run: `eas credentials`
   - Generate new credentials if needed

2. **Node.js version warnings**:
   - These are warnings and don't affect the build
   - Consider updating Node.js to v20.19.4+ for better compatibility

3. **Local build fails**:
   - Ensure ANDROID_HOME is set correctly
   - Make sure Android SDK is installed
   - Try cleaning: `cd android && ./gradlew clean`

4. **APK not installing**:
   - Enable "Install from Unknown Sources"
   - Check if the APK is corrupted during transfer

## 📊 Build Status Commands

- Check recent builds: `eas build:list`
- View specific build: `eas build:view [BUILD_ID]`
- Cancel build: `eas build:cancel [BUILD_ID]`

## 🎯 Tips

1. **For testing**: Use `preview` profile (builds APK)
2. **For Play Store**: Use `production` profile and change to `buildType: "aab"`
3. **For development**: Use `development` profile with Expo Dev Client
4. **Faster builds**: Use `--local` flag if you have Android environment set up

---

**Current Build Status**: Check https://expo.dev/accounts/abelkiprop/projects/snake-game/builds for your latest builds.
