# Privacy Policy for Birthday Blitz

**Last Updated:** July 21, 2026

Birthday Blitz ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy outlines how our Chrome Extension collects, uses, protects, retains, and deletes your data—specifically Google user data obtained via Google APIs.

---

## 1. How We Use Google User Data

Birthday Blitz accesses Google user data strictly through official Google Calendar API scopes (`https://www.googleapis.com/auth/calendar.events` and `https://www.googleapis.com/auth/calendar.readonly`).

- **Data Accessed:**
  - **Calendar List:** We access your list of Google Calendars so you can choose which calendar you wish to save birthdays to.
  - **Account Identification:** We access basic account information (such as your primary calendar email address) strictly to display your logged-in status in the extension popup.
  - **Event Creation:** We request write access to create new events in the calendar of your choice.

- **How Data Is Used:**
  - Data retrieved from Google APIs is used **exclusively** to populate the calendar dropdown in the extension UI and to create annual recurring birthday events (formatted as `[Name]'s Birthday`) in your designated calendar.
  - We **do not** use Google user data for advertising, marketing, profiling, behavioral tracking, or training machine learning/AI models.
  - We **do not** sell, rent, or transfer Google user data to third parties under any circumstances.

- **Google API Limited Use Disclosure:**
  Birthday Blitz's use and transfer to any other app of information received from Google APIs adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

---

## 2. Data Protection Mechanisms for Sensitive Data

We implement robust security measures to protect your sensitive Google user data:

- **Encryption in Transit:** All communications between Birthday Blitz and Google API endpoints occur over secure, encrypted HTTPS connections using TLS (Transport Layer Security) 1.2 or higher.
- **OAuth 2.0 Security:** User authentication is handled entirely via Google's official `chrome.identity` OAuth 2.0 framework. Birthday Blitz never prompts for, accesses, sees, or stores your Google account password.
- **Client-Side Execution & Storage:** Birthday Blitz runs entirely client-side inside your browser sandbox. We do not host external database servers. OAuth tokens are cached securely by Chrome's identity service, and minimal UI state (such as your last selected calendar ID preference) is saved locally in Chrome's sandboxed local storage (`chrome.storage.local`).
- **No External Servers:** Because we maintain no central server infrastructure, your calendar data is never transmitted to, processed by, or stored on any server owned or operated by us or third parties.

---

## 3. Data Retention and Deletion of Google User Data

- **Data Retention:**
  - Birthday Blitz **does not retain or store** your Google user data (calendar events, calendar names, or profile info) on any external server.
  - Data fetched from Google APIs exists only temporarily in your browser's memory while the popup window is active.
  - Local extension storage (`chrome.storage.local`) only persists your preferred calendar ID locally on your device.

- **Data Deletion & Access Revocation:**
  - **Logout in App:** Clicking the **Logout** button inside Birthday Blitz immediately revokes your OAuth access token using Google's revocation endpoint (`https://accounts.google.com/o/oauth2/revoke`), clears the cached token from Chrome, and removes all local extension storage.
  - **Revoking via Google Account:** You can revoke Birthday Blitz's access to your Google Account at any time by visiting [Google Account Security - Third-party apps with account access](https://myaccount.google.com/permissions).
  - **Uninstalling the Extension:** Uninstalling Birthday Blitz automatically purges all extension files, settings, and cached local storage from your browser.

---

## 4. Third-Party Sharing

We do not share, sell, trade, or transfer any Google user data or personal information to any third parties.

---

## 5. Contact Us

If you have any questions or concerns regarding this Privacy Policy or data practices, please contact us at:
- **Website / Support:** [https://tobyyeung.github.io/](https://tobyyeung.github.io/)
- **GitHub Repository:** [https://github.com/tobyyeung/birthdayblitz](https://github.com/tobyyeung/birthdayblitz)
