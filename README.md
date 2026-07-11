# Hope Gala site — GitHub Pages structure

Migrated from GoDaddy `public_html`. What changed and why, plus what's still
needed from you before this can go live.

## What was fixed automatically

1. **`.php` → `.html`** — `index.php`, `gala.php`, `ministries.php`,
   `gallery.php` had zero actual PHP code in them; they were plain HTML
   wearing a `.php` extension. GitHub Pages doesn't execute PHP, and won't
   even serve `.php` as a webpage (it'll offer it as a download instead of
   rendering it) - so these had to be renamed. All internal nav links were
   updated to match.
2. **Backslash paths → forward slashes** — every image was linked like
   `src="Images\photo.jpg"`. That's a Windows file path, not a web path.
   Browsers only accept `/`. This likely never rendered correctly on any
   real server (Windows lets you preview local files with backslashes,
   which is probably why it looked fine while you were building it).
3. **Everything nested under `assets/`** — `Images/`, the loose `Gala Night/`
   folder, and the loose `Hope Gala 2022/` folder are now all under one
   `assets/images/` parent, lowercased and de-spaced.

## Folder map

```
hopegala/
├── index.html
├── gala.html
├── ministries.html
├── gallery.html
├── CNAME                          → contains "hopegala.bz"
├── .nojekyll                      → tells GitHub Pages: don't run Jekyll
├── assets/
│   ├── css/
│   │   └── hoja.css
│   ├── images/
│   │   ├── (51 loose files)      → was top-level "Images/"
│   │   ├── 2024/        (23)     → was "Images/2024/"
│   │   ├── ministries/  (21)     → was "Images/Ministries/"
│   │   ├── gala-night-2023/ (78) → was top-level "Gala Night/"
│   │   └── hope-gala-2022/ (74)  → was top-level "Hope Gala 2022/"
│   └── video/
│       └── documentary-gala.mp4  → was "Images/Documentary Gala.mp4"
```

Every image/CSS/video path in all four pages was verified programmatically —
same number of `src=`/`href=` attributes before and after (16, 33, 17, 220 —
all matched), so nothing was dropped or duplicated in the rewrite.

## What YOU still need to do

Each `assets/**/PUT_FILES_HERE.txt` lists exactly which real image files
belong in that folder (249 unique files total, pulled directly from what
the pages actually reference). Copy the matching files from your GoDaddy
`Images`, `Gala Night`, and `Hope Gala 2022` folders into place, then delete
the `.txt` placeholders.

**The video needs a decision** — see `assets/video/PUT_FILES_HERE.txt`.
GitHub blocks files over 100MB outright, and Pages can't serve Git LFS
files at all, so this may need to go to YouTube instead of living in the
repo. Check the file size first.

**Two things I couldn't account for:** your `public_html` also had a
"2025 Update" folder plus two zip files ("2025 Update.zip",
"2025 Update 2.0.zip") that aren't referenced by any of the four pages
above. Not included here — let me know what those are and I'll fold them
in.
