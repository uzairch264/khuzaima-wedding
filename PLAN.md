# Khuzaima Rashid — Digital Wedding Invitation

React + Vite one-page invitation. Soft ivory design, gift-box opening, and the URL decides which events a guest sees.

## Run it

```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/ — upload to Netlify / Vercel / Cloudflare Pages / GitHub Pages
```

## URL rules

Each event has a **code** (set in `src/config.js`): **Mehndi = `0301`**, **Barat = `0707`**, **Walima = `973`**. Event names in the URL do not work, only codes.

| URL | Guest sees |
|---|---|
| `/` | Announcement only: *Khuzaima Rashid weds Daughter of Ch. M. Ashraf* |
| `/?0301` | Mehndi only |
| `/?0707` | Barat only |
| `/?973` | Walima only |
| `/?0301&0707` | Mehndi + Barat |
| `/?0301&973` | Mehndi + Walima |
| `/?0301&0707&973` | All three |

- Also accepted: `?events=0301,0707` and `?e=0301-0707`.
- Events always appear in ceremony order, whatever order the codes are in.
- Add `&to=Khan%20Family` to personalise the gift tag and greeting, and `&lang=ur` to open in Urdu.
- **Link maker for the family:** open `/#links`, tick events, type a name, copy the link, and send it on WhatsApp.

## Page flow

1. **Gift box**: ivory box with a sage ribbon and a seal. Tap to open: the ribbon slides off, the lid flies open, light rays and gold confetti burst out, and the invitation card rises out and zooms into the page. Music starts on that tap.
2. **Hero**: Bismillah, hosts line, couple's names, and the list of events.
3. **Verse and families**: Surah Ar-Rum 30:21, plus the Rashid and Ashraf families.
4. **The Celebrations**: one card per invited event with its own illustration, date, programme times, venue, a map link and an add-to-calendar button.
5. **Countdown** to the first upcoming invited event.
6. **Closing**: dua, "Looking forward", and the R.S.V.P list (tap-to-call numbers for Ch. Rashid Ali and Ch. Sadaqat Ali; Rabi Rashid, Tanzeel Waheed and Abdul Moiz listed without numbers).
7. **Finale**: monogram, names, date range · city, and the stone urns of white roses.

Top-right on every screen: **English / اردو** switch (also `?lang=ur` in the link) and a **music mute/unmute** button. Music is a soft generated piece started by the gift-box tap; to use your own track, set `music` in `src/config.js`.

Layout adapts to phone, tablet and desktop (events sit side by side on wide screens).

Announcement mode (no events in the URL) shows only the hero, closing and finale: no verse, events, countdown or RSVP list.

## Where things are

- `src/config.js`: **all content** (names, dates, programme times, venues, RSVP contacts, music). Edit this only.
- `src/lib/invite.js`: URL parsing, date formatting, calendar and map links.
- `src/components/`: `GiftIntro`, `Hero`, `Verse`, `Celebrations` (with `Illustrations`), `Countdown`, `Rsvp`, `Closing`, `Flowers`, `MusicButton`, `LinkMaker`.
- `src/styles.css`: the whole look.
- `public/assets/music.mp3`: add your own file. The music button hides itself if it's missing.

## Libraries

React 18, Vite 6, GSAP 3.13 + ScrollTrigger + @gsap/react (animation), Lenis (smooth scroll), canvas-confetti (the burst when the box opens). Fonts: Pinyon Script, EB Garamond, Amiri.

## Content still needed

- **Bride's name.** The cards only say "D/o Ch. M. Ashraf", so that is what shows. Change `couple[1]` in `config.js` when you have it.
- **Home address or map link** for the Mehndi and Barat ("Home Sweet Home"). Until you add `address` or `map`, the "View on map" link is hidden for those two.
- **Qasr-e-Mussarat map link** (optional). It currently searches by name and address.
- **Music file** (optional): put it in `public/assets/` and set `music` in `src/config.js`. By default (`music: ""`) the built-in soft generated music plays, with no file or 404.
- **Urdu text.** Translations are in the `ur` block of `config.js` and `src/lib/i18n.jsx`; worth a read-through by a native speaker.
- **Event end times** are estimates (used only for the add-to-calendar button).
