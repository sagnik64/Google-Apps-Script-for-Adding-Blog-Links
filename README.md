# Google Apps Script for Adding Blog Links
Google Apps Script for fetching blogs links from Calendar Sheet and appending blog title, summary, action item headings in Blog Summary Document and in Read Blogs Sheet.

# How to setup and use the script
- Create a project from Google Drive
  - Open [Google Drive](https://drive.google.com/)
  - Create **New Folder** (suggested)
  - Click **New** > **More** > **Google Apps Script**
  - Add the code of the script
- Set Environment Variables
  - In line number 5, Copy and Paste your Blog Summary Document Id if blogSummaryDocId has empty string as value
    - ```javascript
        "blogSummaryDocId": "",
        ```
    - In line number 9, Copy and Paste your Team Calendar Sheet Id if calendarSheetId has empty string as value
    - ```javascript
        "calendarSheetId": "",
        ```
    - In line number 13, Copy and Paste your Read Blog Sheet Id if blogSummarySheetId has empty string as value
    - ```javascript
        "blogSummarySheetId": ""
        ```
- Save and run your app script

# Testing 
- Before running the Google Apps Script for the actual Ids of the required sheets and document, please test the script first by adding sample sheets and documents which are copy of the main sheets and document. 
- Please report if there are any errors.
