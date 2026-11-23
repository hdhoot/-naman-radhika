/**
 * RSVP receiver for the wedding invitation.
 * One row per family: a reply with a mobile number that is already in the sheet
 * updates that family's row instead of adding a new one.
 * Jodhpur (30 Nov) and Pushkar (10 & 11 Dec) replies go to separate tabs: "RSVP Jodhpur" and "RSVP Pushkar".
 *
 * Setup: Google Sheet → Extensions → Apps Script → paste this → Save.
 * Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * After changing this code: Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.
 */
const TABS = { jodhpur: "RSVP Jodhpur", pushkar: "RSVP Pushkar", all: "RSVP" };
const HEADERS = ["First replied", "Last updated", "Invited as", "Family", "Name", "Mobile", "Attending",
                 "Side", "Events", "People", "From city", "Arriving", "Leaving", "Note", "Times submitted", "From Jodhpur"];
const MOBILE_COL = 6;   // column F

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const tab = TABS[d.invite] || TABS.all;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(tab) || ss.insertSheet(tab);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
    sh.setFrozenRows(1);

    const mobile = String(d.phone || "").replace(/\D/g, "").slice(-10);
    const now = new Date();
    const row = [now, now, d.invitedAs || "", d.family || "", d.name || "", mobile ? "'" + mobile : "",
                 d.attending || "", d.side || "", (d.events || []).join(", "), d.guests || 0,
                 d.city || "", d.arrive || "", d.leave || "", d.note || "", 1, d.local || ""];

    let found = 0;
    const last = sh.getLastRow();
    if (mobile && last > 1) {
      const mobiles = sh.getRange(2, MOBILE_COL, last - 1, 1).getDisplayValues();
      for (let i = 0; i < mobiles.length; i++) {
        if (String(mobiles[i][0]).replace(/\D/g, "").slice(-10) === mobile) { found = i + 2; break; }
      }
    }
    if (found) {
      const old = sh.getRange(found, 1, 1, HEADERS.length).getValues()[0];
      row[0] = old[0] || now;                        // keep the first reply time
      row[14] = (Number(old[14]) || 1) + 1;          // count how many times this family submitted
      sh.getRange(found, 1, 1, HEADERS.length).setValues([row]);
    } else {
      sh.appendRow(row);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, updated: !!found }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
