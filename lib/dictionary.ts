export type Lang = "en" | "ar";

export const dictionary = {
  en: {
    nav: {
      home: "Home",
      menu: "Menu",
      experience: "Experience",
      about: "About",
      contact: "Contact",
      switch: "AR",
    },
    loader: {
      line1: "Rule Number 1.",
      line2: "Never Be Number 2.",
    },
    hero: {
      eyebrow: "128 Cafe & Bakery",
      title1: "Rule Number 1.",
      title2: "Never Be Number 2.",
      support: "Coffee. Bakery. Breakfast. More.",
      cta: "Explore the Menu",
      scroll: "Scroll",
      sequence: [
        { title1: "Rule Number 1.", title2: "Never Be Number 2.", support: "Coffee. Bakery. Breakfast. More." },
        { title1: "Better mornings", title2: "start here.", support: "Coffee and breakfast made for a better start." },
        { title1: "Layers worth", title2: "slowing down for.", support: "Croissants and baked goods made for the details." },
        { title1: "More than", title2: "coffee.", support: "Desserts, matcha, cold drinks and more." },
        { title1: "Every mood", title2: "has a 128.", support: "Choose what fits your mood." },
      ],
      // v2 cinematic hero — one continuous editorial story, scrubbed to scroll
      story: [
        { title1: "Rule Number 1.", title2: "Never Be Number 2.", title3: "" },
        { title1: "Everything", title2: "starts with detail.", title3: "" },
        { title1: "Coffee.", title2: "Bakery.", title3: "Desserts." },
        { title1: "Every mood", title2: "has its match.", title3: "" },
        { title1: "Make your time", title2: "taste better.", title3: "" },
      ],
      // chapter 2 — product world identity (stacked)
      world: ["Coffee.", "Bakery.", "Desserts.", "And more."],
    },
    intro: {
      kicker: "Est. 2012 — One Two Eight",
      heading: "More than coffee.",
      body:
        "Specialty drip, laminated pastry, all-day breakfast, desserts, cold drinks — and a room built for the moment in between. 128 is where detail and ease sit at the same table.",
      pillars: ["Coffee", "Bakery", "Breakfast", "Dessert", "Cold Drinks", "Café"],
    },
    menu: {
      kicker: "The Menu",
      heading: "A universe of flavour.",
      sub: "Eighteen categories. One standard.",
      viewAll: "View Full Menu",
      more: "And more inside",
    },
    featured: {
      kicker: "Signature Picks",
      heading: "Made to be remembered.",
    },
    experience: {
      kicker: "The 128 Experience",
      heading1: "Not just what you order.",
      heading2: "How the moment feels.",
      body:
        "Warm light, quiet detail, and a counter that knows your order. A place to begin the day slowly or end it well.",
    },
    moment: {
      line: "Never Be Number 2.",
      caption: "One. Two. Eight.",
    },
    visit: {
      kicker: "Visit & Contact",
      heading: "Meet us at 128.",
      body: "New Damietta, Street 15. Open daily — breakfast served 8:30 AM to 3:00 PM.",
      call: "Call",
      whatsapp: "WhatsApp",
      email: "Email",
      directions: "Get Directions",
      location: "Location",
      hours: "Breakfast 8:30 AM – 3:00 PM",
      follow: "Follow",
    },
    footer: {
      line1: "Rule Number 1.",
      line2: "Never Be Number 2.",
      rights: "128 Cafe & Bakery. All rights reserved.",
      crafted: "New Damietta, Egypt",
    },
    currency: "EGP",
  },
  ar: {
    nav: {
      home: "الرئيسية",
      menu: "المنيو",
      experience: "التجربة",
      about: "عن 128",
      contact: "تواصل",
      switch: "EN",
    },
    loader: {
      line1: "القاعدة رقم ١.",
      line2: "متبقاش رقم ٢.",
    },
    hero: {
      eyebrow: "128 كافيه وبيكري",
      title1: "القاعدة رقم ١.",
      title2: "متبقاش رقم ٢.",
      support: "قهوة. مخبوزات. فطور. وأكتر.",
      cta: "اكتشف المنيو",
      scroll: "انزل",
      sequence: [
        { title1: "القاعدة رقم ١.", title2: "متبقاش رقم ٢.", support: "قهوة. مخبوزات. فطور. وأكثر." },
        { title1: "الصبح يبدأ", title2: "بطعم أحسن.", support: "قهوة وفطور معمولين لروقان البداية." },
        { title1: "طبقات", title2: "تستاهل الوقفة.", support: "كرواسون ومخبوزات معمولة للتفاصيل." },
        { title1: "مش بس", title2: "قهوة.", support: "حلويات، ماتشا، مشروبات باردة وأكتر." },
        { title1: "كل مزاج", title2: "له 128.", support: "اختار اللي على مزاجك." },
      ],
      // v2 cinematic hero — one continuous editorial story, scrubbed to scroll
      story: [
        { title1: "القاعدة رقم ١.", title2: "متبقاش رقم ٢.", title3: "" },
        { title1: "كل حاجة", title2: "بتبدأ بتفصيلة.", title3: "" },
        { title1: "قهوة.", title2: "مخبوزات.", title3: "حلويات." },
        { title1: "كل مزاج", title2: "له حاجة.", title3: "" },
        { title1: "خلي وقتك", title2: "أحلى مع 128.", title3: "" },
      ],
      // chapter 2 — product world identity (stacked)
      world: ["قهوة.", "مخبوزات.", "حلويات.", "وأكتر."],
    },
    intro: {
      kicker: "من 2012 — ون تو إيت",
      heading: "أكتر من مجرد قهوة.",
      body:
        "سبيشيالتي دريب، مخبوزات مورّقة، فطور طوال اليوم، حلويات ومشروبات باردة — ومكان مصمّم للّحظة اللي بينهم. 128 هو المكان اللي بيجمع التفاصيل والبساطة على نفس الطاولة.",
      pillars: ["قهوة", "مخبوزات", "فطور", "حلويات", "مشروبات باردة", "كافيه"],
    },
    menu: {
      kicker: "المنيو",
      heading: "عالم من النكهات.",
      sub: "ثمانية عشر قسمًا. ومعيار واحد.",
      viewAll: "عرض المنيو كامل",
      more: "والمزيد بالداخل",
    },
    featured: {
      kicker: "اختياراتنا المميزة",
      heading: "مصنوعة لتبقى في الذاكرة.",
    },
    experience: {
      kicker: "تجربة 128",
      heading1: "مش بس اللي بتطلبه.",
      heading2: "اللحظة نفسها هي المهمة.",
      body:
        "إضاءة دافية، تفاصيل هادية، وبار بيعرف طلبك. مكان تبدأ بيه يومك على مهلك أو تختمه صح.",
    },
    moment: {
      line: "متبقاش رقم ٢.",
      caption: "واحد. اتنين. تمانية.",
    },
    visit: {
      kicker: "زورنا وتواصل معنا",
      heading: "مستنيينك في 128.",
      body: "دمياط الجديدة، شارع 15. مفتوح يوميًا — الفطور من 8:30 صباحًا حتى 3:00 عصرًا.",
      call: "اتصال",
      whatsapp: "واتساب",
      email: "إيميل",
      directions: "الاتجاهات",
      location: "الموقع",
      hours: "الفطور 8:30 ص – 3:00 م",
      follow: "تابعنا",
    },
    footer: {
      line1: "القاعدة رقم ١.",
      line2: "متبقاش رقم ٢.",
      rights: "128 كافيه وبيكري. جميع الحقوق محفوظة.",
      crafted: "دمياط الجديدة، مصر",
    },
    currency: "ج.م",
  },
};

export type Dict = (typeof dictionary)["en"];
