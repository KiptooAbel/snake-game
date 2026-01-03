#!/bin/bash

# Production Build Test Script
# This script helps identify issues in production builds

echo "========================================="
echo "Production Build Testing Helper"
echo "========================================="
echo ""

echo "✓ Checking for common production issues..."
echo ""

# Check 1: __DEV__ usage
echo "1. Checking __DEV__ references..."
if grep -r "if (__DEV__)" client --include="*.ts" --include="*.tsx" 2>/dev/null; then
    echo "⚠️  Found unsafe __DEV__ usage. Use: typeof __DEV__ !== 'undefined' && __DEV__"
else
    echo "✓ No unsafe __DEV__ usage found"
fi
echo ""

# Check 2: console.log in production
echo "2. Checking console.log usage..."
LOG_COUNT=$(grep -r "console\." client --include="*.ts" --include="*.tsx" | wc -l)
echo "   Found $LOG_COUNT console statements"
echo "   Note: These are OK but may impact performance"
echo ""

# Check 3: API configuration
echo "3. Checking API configuration..."
if grep -q "https://snake.abelk.dev/api" client/services/apiService.ts; then
    echo "✓ Production API URL configured"
else
    echo "⚠️  Production API URL not found"
fi
echo ""

# Check 4: Error boundaries
echo "4. Checking error boundary implementation..."
if [ -f "client/components/ErrorBoundary.tsx" ]; then
    echo "✓ ErrorBoundary component exists"
else
    echo "❌ ErrorBoundary component missing"
fi
echo ""

# Check 5: AsyncStorage usage
echo "5. Checking AsyncStorage usage..."
ASYNC_COUNT=$(grep -r "AsyncStorage" client --include="*.ts" --include="*.tsx" | wc -l)
echo "   Found $ASYNC_COUNT AsyncStorage references"
echo ""

echo "========================================="
echo "Build Instructions"
echo "========================================="
echo ""
echo "To build and test the APK:"
echo ""
echo "1. Build locally:"
echo "   cd client"
echo "   npx expo prebuild --platform android --clean"
echo "   cd android"
echo "   ./gradlew assembleRelease"
echo ""
echo "2. Install APK:"
echo "   adb install app/build/outputs/apk/release/app-release.apk"
echo ""
echo "3. Check logs:"
echo "   adb logcat | grep -E 'ReactNativeJS|ExpoError'"
echo ""
echo "4. Test specific scenarios:"
echo "   - Open app without network"
echo "   - Open app with network"
echo "   - Try login flow"
echo "   - Check if error boundary catches crashes"
echo ""
echo "========================================="
echo "Common Issues & Fixes"
echo "========================================="
echo ""
echo "Issue: App crashes on startup"
echo "Fix: Check network connectivity, API URL, AsyncStorage permissions"
echo ""
echo "Issue: White screen"
echo "Fix: Check console logs, verify all assets loaded"
echo ""
echo "Issue: Error boundary shows"
echo "Fix: Network error, check API endpoint, add better error handling"
echo ""
echo "========================================="
