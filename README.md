[中文文档](https://github.com/Panzer-Jack/AmiAmi-subscriber/blob/main/README_ZH.md)

AmiAmi Item Subscription Notifier

This project monitors specified search pages on AmiAmi (an online store for anime figures and merchandise) and sends email notifications when new items or updates are detected.

Features
- Automatically monitors specified AmiAmi search pages.
- Triggers notifications when new items or updates are detected.
- Sends update notifications via email.
- Saves the running state to avoid duplicate notifications.

Prerequisites
	1. Node.js (version >= 16.0.0).
	2. Playwright for browser automation.
	3. Nodemailer for sending emails.

Installation Steps

1.	Clone the project repository:
```
git clone https://github.com/your-username/amiami-notifier.git
cd amiami-notifier
```

2.	Install dependencies:
```
npm install
```

3.	Configure email settings in index.js:
```js
const MY_Email = 'your-email@example.com'; // Email to receive notifications
const SERVER_EMAIL = 'server-email@example.com'; // Email used to send notifications
const SERVER_EMAIL_PASS = 'your-email-password'; // Password for the sender email
```
4.	Replace the URLS array with the AmiAmi search links you want to monitor:
```js
const URLS = [
    'https://www.amiami.com/cn/search/list/?s_maker_id=7824&...',
    'https://www.amiami.com/cn/search/list/?s_maker_id=273&...'
];
```
Usage

Manually Run the Script

Run the script using Node.js:
```
node src/index.js
```
Schedule the Script with Cron

If you want to check for updates regularly, you can use cron to schedule tasks:
1.	Open the crontab editor:
```
crontab -e
```

2.	Add the following line to schedule the script to run daily at 9 PM:
```
0 21 * * * /path/to/node /path/to/project/src/index.js >> /path/to/project/cron_output.log 2>&1
```

How It Works
1. Browser Automation:
	- Uses Playwright to automatically open the specified AmiAmi search pages.
	- Intercepts API responses from the page to retrieve item data.
2. State Comparison:
	- Saves the current item state to the lastState.json file.
	- Compares it with the previously saved state to detect new items or updates.
3. Email Notifications:
	- If updates are detected, sends email notifications with links to the updated pages.

Contribution

We welcome you to fork this repository and submit pull requests to add new features or improve existing ones!
