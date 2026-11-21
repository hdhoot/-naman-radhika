/**
 * RSVP receiver for the wedding invitation.
 * 1. Create a Google Sheet. Extensions → Apps Script. Paste this file. Save.
 * 2. Deploy → New deployment → type "Web app".
 *    Execute as: Me.  Who has access: Anyone.  → Deploy, allow access.
 * 3. Copy the web-app URL (ends in /exec) into CONFIG.sheetUrl in index.html.
 */
const SHEET_NAME = "RSVP";
const HEADERS = ["Time", "Invited as", "Attending", "Name", "Side", "Events", "People", "From city", "Arriving", "Leaving", "Note"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    const d = JSON.parse(e.postData.contents);
    sh.appendRow([
      new Date(), d.invitedAs || "", d.attending || "", d.name || "", d.side || "",
      (d.events || []).join(", "), d.guests || 0, d.city || "", d.arrive || "", d.leave || "", d.note || ""
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
