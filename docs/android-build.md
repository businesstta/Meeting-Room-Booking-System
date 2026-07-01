# Android Production Build

## Architecture

The Capacitor application bundles the Room Display UI in `mobile-www`. The
generated assets are copied into the Android project during synchronization.
There is no `server.url` and no production `allowNavigation` list.

```text
Bundled UI (https://localhost) ──HTTPS──► https://office.atoz.com.mm/api
```

The API domain is public configuration, not a secret. Authentication remains in
an HttpOnly cookie; passwords and session tokens are not stored in localStorage.

## Requirements

- Node.js 22 and npm 10+
- JDK 21
- Android Studio and Android SDK API 36
- Android build tools compatible with the checked-in Gradle project

Current version information must be read from `android/app/build.gradle`; do not
copy version numbers into release procedures.

## Synchronize bundled assets

```bash
npm ci
npm run cap:sync
```

`cap:sync` runs `scripts/prepare-mobile.mjs`, copying the selected web assets
into `mobile-www`, before Capacitor updates `android/app/src/main/assets`.

Inspect the generated configuration before release:

```bash
cat android/app/src/main/assets/capacitor.config.json
```

It must not contain `server`, `allowNavigation`, or cleartext settings.

## Debug build

Debug APKs are for internal testing only:

```bash
cd android
./gradlew assembleDebug
```

The customized output is:

```text
android/app/build/outputs/apk/debug/AtoZ Meeting Room Booking.apk
```

## Release signing

Create one upload keystore and protect it with an organizational backup process:

```bash
keytool -genkeypair -v \
  -keystore /secure/path/atoz-release.jks \
  -alias atoz-meeting-room \
  -keyalg RSA -keysize 4096 -validity 10000
```

Set signing values in the build environment, never in Git:

```bash
export ANDROID_KEYSTORE_FILE=/secure/path/atoz-release.jks
export ANDROID_KEYSTORE_PASSWORD='keystore-password'
export ANDROID_KEY_ALIAS=atoz-meeting-room
export ANDROID_KEY_PASSWORD='key-password'
```

`.env.android.example` documents variable names only.

## Signed AAB

```bash
npm run cap:sync
cd android
./gradlew bundleRelease -PrequireReleaseSigning=true
```

The guard intentionally fails when any signing value is missing. The output is:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Release builds enable R8 minification, resource shrinking, disabled debugging,
disabled backups, and HTTPS-only traffic.

## Release verification

Before Play upload:

- Confirm the AAB is signed with the intended upload certificate.
- Confirm the version code is higher than the previous release.
- Install a Play-generated APK through an internal-testing track.
- Test login, session expiration, Book Now, conflicts, cancellation, notification
  refresh, network loss, and app restart.
- Test low-end Android 7/8 hardware and representative Android 13–16 devices.
- Check tablet portrait/landscape layouts and multiple screen sizes.
- Verify no employee or production booking data appears in screenshots or test
  accounts supplied to reviewers.

## Play Console requirements

- Privacy-policy URL
- Data Safety declaration matching actual collection and transmission
- Content rating
- Store description, icon, screenshots, and support contact
- Reviewer access instructions and a restricted test account
- Internal testing before staged production rollout

