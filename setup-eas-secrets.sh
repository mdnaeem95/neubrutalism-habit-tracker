#!/bin/bash

# Setup EAS Secrets for Block Habit Tracker
# This script sets all environment variables as EAS secrets for cloud builds

echo "Setting up EAS Secrets..."

eas secret:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "AIzaSyBUhexE7Q-2e7FTOEicJkP5bmKb-fMWK9U" --type string --force

eas secret:create --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "neubrut-habit-tracker.firebaseapp.com" --type string --force

eas secret:create --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "neubrut-habit-tracker" --type string --force

eas secret:create --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "neubrut-habit-tracker.firebasestorage.app" --type string --force

eas secret:create --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "516091757249" --type string --force

eas secret:create --name EXPO_PUBLIC_FIREBASE_APP_ID --value "1:516091757249:web:652e133fe93b25d31f4a40" --type string --force

eas secret:create --name EXPO_PUBLIC_SENTRY_DSN --value "https://a26856ea8ef37fd9626f74fcd85c951c@o4507860915257344.ingest.us.sentry.io/4510831523725312" --type string --force

eas secret:create --name EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY --value "appl_UwBxIcKOdnyymAeJrGiFEJXwrtD" --type string --force

echo "✅ All EAS Secrets configured!"
echo ""
echo "You can view your secrets with: eas secret:list"
