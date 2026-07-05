# Birthday Blitz 🎂

Never forget a birthday again! Birthday Blitz is a Google Chrome extension that lets you quickly and easily add birthdays directly to your Google Calendar. 

## Features

- **Google Calendar Integration:** Seamlessly signs in with your Google account using OAuth 2.0 to securely access and update your calendars.
- **Quick Add UI:** A sleek, user-friendly popup interface to quickly select a date, input a name, and add the event.
- **Calendar Selection:** Choose exactly which of your Google Calendars you want to add the birthday to.
- **Automatic Formatting:** Automatically formats the event as "[Name]'s Birthday".

## Installation

Since this is an unpacked extension, you can install it locally in Google Chrome for testing:

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click on the **Load unpacked** button in the top left.
5. Select the `birthday-blitz` directory where you saved the files.
6. The Birthday Blitz extension will now appear in your list of installed extensions. Pin it to your toolbar for easy access!

## Usage

1. Click the Birthday Blitz extension icon in your Chrome toolbar.
2. Click **Sign in with Google** to authenticate the extension and grant it permission to access your calendars.
3. Select the calendar you want to save the birthday to from the dropdown.
4. Enter the person's name and their birthdate.
5. Click **Add to Calendar**. A success message will appear once the event is saved!

## Technologies Used

- HTML / CSS / Vanilla JavaScript
- Google Chrome Extension Manifest V3
- Google Calendar API
- Google Identity Services (OAuth 2.0)
