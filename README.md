# Wedding invitation

A one-file wedding website with a personal link for each guest.

## 1. Put in your details
Open `index.html` and edit only the `CONFIG` block (search for `EDIT HERE`):
names, dates, events, dress codes, venue, travel notes, checklist, contacts, WhatsApp link.
Also change the `<meta>` tags at the top (title and description shown when the link is shared).
Optional: add a 1200×630 photo named `og.jpg` next to `index.html` for the WhatsApp link preview.

Open `index.html` in your browser to check it. Add `?name=Harshit` to the address to see a personal version.

## 2. Collect RSVPs in a Google Sheet
1. Create a Google Sheet → **Extensions → Apps Script**.
2. Paste the contents of `apps-script.gs`, save.
3. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. Deploy and allow.
4. Copy the URL ending in `/exec` into `sheetUrl` in `CONFIG`.

Every RSVP becomes a row: name, side, events, number of people, travel dates, note,
and the name the link was sent to ("Invited as").
RSVPs are not sent when the page is opened from your computer (file://), so test on the live site.

## 3. Put it online for free (GitHub Pages)
1. On github.com create a public repo, e.g. `wedding`.
2. **Add file → Upload files**: `index.html` (and `og.jpg` if you have one). Commit.
3. **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)` → Save.
4. After a minute the site is at `https://<your-username>.github.io/wedding/`.

## 4. Send a personal link to each guest
In a Google Sheet, put guest names in column A and this formula in B2, then drag down:

    ="https://<your-username>.github.io/wedding/?name="&ENCODEURL(A2)

Each guest sees "Dear <their name>," and their name is pre-filled in the RSVP.
