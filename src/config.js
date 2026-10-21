/* =========================================================
   ✏️  EDIT EVERYTHING HERE — no need to touch any other file.
   Content taken from the printed invitation cards.
   ========================================================= */
const WEDDING = {
  // The couple — shown in this order. `prefix` is a small line above the name.
  couple: [
    { name: "Khuzaima Rashid", family: "Rashid" },
    { prefix: "Daughter of", name: "Ch. M. Ashraf", family: "Ashraf" },
  ],
  connector: "weds",
  city: "Haroon Abad", // shown on the closing page

  // Hosts line on the main invitation
  hosts: "Mr. & Mrs. Rashid Ali",
  hostsLine: "cordially invite you at the wedding ceremony of their beloved son",
  elders: "Mr. & Mrs. Haji M. Arshad (Late)",

  // Letters on the wax seal of the gift box
  initials: "KR",

  // Shown on the no-event (announcement) version
  announcementLine: "A new beginning, InshaAllah",
  announcementSub: "Kindly keep them in your duas.",

  // Contact numbers shown (tap-to-call) in the closing section. Local format.
  rsvpContacts: [
    { name: "Ch. Rashid Ali", phone: "0300-0328893" },
    { name: "Ch. Sadaqat Ali", phone: "0300-8009293" },
    { name: "Rabi Rashid" },      // no phone → shown as a plain name
    { name: "Tanzeel Waheed" },
    { name: "Abdul Moiz" },
  ],

  lookingForward: "All family members, relatives & friends",

  // Background music (played after the box is opened). Button hides if the file is missing.
  music: "assets/music.mp3", // put the file in public/assets/

  signOff: "With love & duas — the families",

  // Events. `code` is what goes in the guest's link: ?0301 = Mehndi, ?0707 = Barat, ?973 = Walima
  // (combine them: ?0301&0707, ?0301&973, ?0301&0707&973). Names in the URL do not work.
  // Times are Pakistan Standard Time (+05:00). `start`/`end` drive the countdown and
  // calendar button (`end` is an estimate); `program` is what guests see.
  // `map`: a Google Maps link. Without `map` or `address`, the "View on map" link is hidden.
  events: {
    mehndi: {
      title: "Mehndi",
      code: "0301",
      tagline: "An evening of dinner, colour & henna",
      blurb: "Dinner first, then the mehndi — come hungry, leave painted.",
      start: "2026-11-07T18:00:00+05:00",
      end: "2026-11-07T22:30:00+05:00",
      program: [{ label: "Dinner", time: "6:00 PM" }, { label: "Mehndi", time: "7:00 PM" }],
      venue: "Home Sweet Home",
      address: "",
      map: "",
    },
    barat: {
      title: "Barat",
      code: "0707",
      tagline: "Sehra bandi & the departure of the barat",
      blurb: "The sehra, the horse and the happiest procession.",
      start: "2026-11-08T10:00:00+05:00",
      end: "2026-11-08T14:00:00+05:00",
      program: [{ label: "Sehra Bandi", time: "10:00 AM" }, { label: "Departure", time: "11:00 AM" }],
      venue: "Home Sweet Home",
      address: "",
      map: "",
    },
    walima: {
      title: "Walima",
      code: "973",
      tagline: "Reception & Lunch",
      blurb: "A golden afternoon to bless the new beginning.",
      start: "2026-11-09T13:00:00+05:00",
      end: "2026-11-09T16:00:00+05:00",
      program: [{ label: "Reception", time: "1:00 PM" }, { label: "Lunch", time: "2:00 PM" }],
      venue: "Qasr-e-Mussarat Marquee",
      address: "Near Model Avenue, Haroon Abad",
      map: "",
    },
  },

  // Urdu version of every piece of text above. Same shape; anything missing falls back to English.
  ur: {
    couple: [
      { name: "خزیمہ رشید", family: "رشید" },
      { prefix: "بنتِ", name: "چوہدری ایم۔ اشرف سے", family: "اشرف" },
    ],
    connector: "کی شادی",
    city: "ہارون آباد",
    hosts: "مسٹر اینڈ مسز رشید علی",
    hostsLine: "اپنے لختِ جگر کی تقریبِ شادی میں شرکت کی پُرخلوص دعوت دیتے ہیں",
    elders: "مسٹر اینڈ مسز حاجی ایم ارشد (مرحوم)",
    announcementLine: "ایک نئے سفر کا آغاز، ان شاء اللہ",
    announcementSub: "ان کے لیے دعاؤں کی درخواست ہے۔",
    rsvpContacts: [{ name: "چوہدری رشید علی" }, { name: "چوہدری سعادت علی" }, { name: "ربی رشید" }, { name: "تنزیل وحید" }, { name: "عبدالمعیز" }],
    lookingForward: "تمام اہلِ خانہ، رشتہ دار اور دوست احباب",
    signOff: "محبت اور دعاؤں کے ساتھ — دونوں خاندان",
    events: {
      mehndi: {
        title: "مہندی",
        tagline: "کھانے، رنگوں اور مہندی کی شام",
        blurb: "پہلے کھانا، پھر مہندی کی رونق۔",
        program: [{ label: "ڈنر" }, { label: "مہندی" }],
        venue: "ہوم سویٹ ہوم",
      },
      barat: {
        title: "بارات",
        tagline: "سہرا بندی اور بارات کی روانگی",
        blurb: "سہرا، گھوڑی اور خوشیوں بھرا قافلہ۔",
        program: [{ label: "سہرا بندی" }, { label: "روانگی" }],
        venue: "ہوم سویٹ ہوم",
      },
      walima: {
        title: "ولیمہ",
        tagline: "استقبالیہ اور لنچ",
        blurb: "نئی زندگی کی دعاؤں سے بھرپور ایک سنہری دوپہر۔",
        program: [{ label: "استقبالیہ" }, { label: "لنچ" }],
        venue: "قصرِ مسرت میرج ہال",
        address: "نزد ماڈل ایونیو، ہارون آباد",
      },
    },
  },
};

export default WEDDING;
