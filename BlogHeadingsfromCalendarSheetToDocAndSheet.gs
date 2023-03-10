function getEnvironmentVariables() {
  return {
    // Id of your Google Document which contains blog summary
    // Copy and Paste your Blog Summary Document Id if blogSummaryDocId has empty string as value
    "blogSummaryDocId": "",

    // Id of Training Team Calendar Sheet
    // Copy and Paste your Team Calendar Sheet Id if calendarSheetId has empty string as value
    "calendarSheetId": "166NVdyOBcp6cOld3NqnAL4jtya-Prbw-x63D3rWLPMQ",

    // Id of Read Blogs Sheet
    // Copy and Paste your Read Blog Sheet Id if blogSummarySheetId has empty string as value
    "blogSummarySheetId": ""
    };
}

// For removing substrings from blog title which contains semicolon
function removeSubstringsWithSemicolon(str) {
  const substrings = str.split(" ");
  const filteredSubstrings = substrings.filter(substring => !substring.includes(";"));
  const cleanedString = filteredSubstrings.join(" ");
  return cleanedString;
}

// For fetching blog title from metadata
function getBlogTitleFromUrl(url) {
  let response = UrlFetchApp.fetch(url);
  let html = response.getContentText();
  let metadata = /<head>([\s\S]*?)<\/head>/gi.exec(html);
  let title = /<title>([\s\S]*?)<\/title>/gi.exec(metadata[1]);

  title = removeSubstringsWithSemicolon(title[1].trim());
  Logger.log(title);
  return title;

}

// Generates dates of Monday to Friday by week number
function getWeekDates() {
  let date = new Date();
  let weekNumber = Utilities.formatDate(date, Session.getScriptTimeZone(), 'w');
  let year = new Date().getFullYear();
  date = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  let dates = [];

  // Loop through Monday to Friday
  for (let i = 1; i <= 5; i++) {
    let dayOfWeek = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000 + i * 24 * 60 * 60 * 1000);
    let formattedDate = Utilities.formatDate(dayOfWeek, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    dates.push(formattedDate);
  }
  return dates;
}

// Custom sytle
const style1 = {};
style1[DocumentApp.Attribute.FONT_SIZE] = 14;
style1[DocumentApp.Attribute.BOLD] = true;

const style2 = {};
style2[DocumentApp.Attribute.FONT_SIZE] = 12;
style2[DocumentApp.Attribute.BOLD] = false;

const style3 = {};
style3[DocumentApp.Attribute.FONT_SIZE] = 20;
style3[DocumentApp.Attribute.BOLD] = false;

// Appends Title with link, Summary and Action Item headings in Blog Summary Document
function writeToDocument(link, date, title) {

  const docId = getEnvironmentVariables().blogSummaryDocId;
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();
  let heading = body.appendParagraph(title);
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  heading.setLinkUrl(link);
  body.appendParagraph(" " + date).setAttributes(style3);
  let summary = body.appendParagraph("Summary").setAttributes(style1);
  summary.setLinkUrl(doc.getUrl());
  body.appendListItem('').setAttributes(style2).setGlyphType(DocumentApp.GlyphType);
  body.appendParagraph("Action Item").setAttributes(style1);
  body.appendListItem('').setAttributes(style2).setGlyphType(DocumentApp.GlyphType);
  body.appendParagraph("\n\n\n");
}

// Appends Title, Summary, Date and Username in Read Blogs Sheet
function writeToSheet(link, date, title) {
  const sheetId = getEnvironmentVariables().blogSummarySheetId;
  let sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Read Blog');
  if(sheet == null) {
    sheet = SpreadsheetApp.openById(sheetId).getSheets()[1];
  }
  date = Utilities.formatDate(date,"IST","dd/MM/yyyy");
  let summaryUrl = DocumentApp.openById(getEnvironmentVariables().blogSummaryDocId).getUrl();
  let summary = `=HYPERLINK("${summaryUrl}", "Summary")`;
  title = `=HYPERLINK("${link}", "${title}")`;
  sheet.appendRow([title, summary, date, Session.getActiveUser()]);
}

//main function
function blogLinksfromSheettoDoc() {
  const sheetId = getEnvironmentVariables().calendarSheetId;
  const currentEmail = Session.getActiveUser();
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(currentEmail);
  Logger.log("Fetching data from " + sheet);
  
  

  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(`A2:D${lastRow}`).getValues();

  const currentWeekDates = getWeekDates();
  for(let i = 0;i<data.length;i++) {
    date = Utilities.formatDate(data[i][3],"IST","dd/MM/yyyy");
    if(data[i][0].includes("Reading") && data[i][1].length > 0 && currentWeekDates.includes(date)) {
      const link = data[i][1];
      const date = Utilities.formatDate(data[i][3],"IST","(dd-MM-yyyy)");
      const title = getBlogTitleFromUrl(link);
      
      writeToDocument(link, date, title);
      writeToSheet(link, data[i][3], title);
    }
  }
}
