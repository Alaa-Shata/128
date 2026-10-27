// All content verified from the real 128 MENU.pdf. Prices in EGP.

export type Bi = { en: string; ar: string };

export type Category = {
  id: string;
  name: Bi;
  tagline: Bi;
  image?: string; // cutout in /products
};

// Primary categories surfaced on the homepage menu section (strongest first).
export const primaryCategories: Category[] = [
  {
    id: "signature",
    name: { en: "Signature Drinks", ar: "المشروبات المميزة" },
    tagline: { en: "Start strong, sip stronger", ar: "ابدأ بقوة، واستمتع أكثر" },
    image: "so12.png",
  },
  {
    id: "croissant",
    name: { en: "Croissant", ar: "كرواسون" },
    tagline: { en: "Golden layers, delight", ar: "طبقات ذهبية من المتعة" },
    image: "so13.png",
  },
  {
    id: "dessert",
    name: { en: "Dessert", ar: "الحلويات" },
    tagline: { en: "Delicately sweet, deeply satisfying", ar: "حلاوة راقية تُشبع الحواس" },
    image: "so14.png",
  },
  {
    id: "noncoffee",
    name: { en: "Non Coffee", ar: "بدون قهوة" },
    tagline: { en: "Green goodness, crafted for you", ar: "خير أخضر، مصنوع لك" },
    image: "so15.png",
  },
  {
    id: "waffle",
    name: { en: "Waffle Towers", ar: "أبراج الوافل" },
    tagline: { en: "Golden perfection, served warm", ar: "كمال ذهبي يُقدّم دافئًا" },
    image: "so16.png",
  },
  {
    id: "classic",
    name: { en: "128 Classic", ar: "128 كلاسيك" },
    tagline: { en: "Pure, hot, and perfect", ar: "نقية، ساخنة، ومثالية" },
    image: "so17.png",
  },
];

// Full list of categories (as printed in the menu) for the secondary index.
export const allCategories: Bi[] = [
  { en: "Specialty Drip", ar: "سبيشيالتي دريب" },
  { en: "128 Classic", ar: "128 كلاسيك" },
  { en: "Signature Drinks", ar: "المشروبات المميزة" },
  { en: "Non Coffee", ar: "بدون قهوة" },
  { en: "Ice Coffee", ar: "قهوة مثلجة" },
  { en: "Tea & Ice Tea", ar: "شاي ومثلجات الشاي" },
  { en: "Milkshake", ar: "ميلك شيك" },
  { en: "Smoothie", ar: "سموذي" },
  { en: "Fresh Juice", ar: "عصائر طازجة" },
  { en: "Cocktail & Soda", ar: "كوكتيل وصودا" },
  { en: "Breakfast", ar: "الفطور" },
  { en: "Sandwich", ar: "ساندويتش" },
  { en: "Croissant", ar: "كرواسون" },
  { en: "French Toast", ar: "فرنش توست" },
  { en: "Waffle", ar: "وافل" },
  { en: "Dessert", ar: "الحلويات" },
  { en: "Soft Ice Cream", ar: "آيس كريم سوفت" },
  { en: "Extras", ar: "إضافات" },
];

export type Product = {
  name: Bi;
  category: Bi;
  note: Bi;
  price: number;
  image: string;
};

// Featured storytelling products — real items & prices from the menu.
export const featured: Product[] = [
  {
    name: { en: "Pistachio Latte", ar: "لاتيه بالفستق" },
    category: { en: "Signature Drinks", ar: "المشروبات المميزة" },
    note: { en: "Double shot, roasted pistachio, steamed milk.", ar: "شوت دوبل، فستق محمّص، وحليب مبخّر." },
    price: 185,
    image: "so2.png",
  },
  {
    name: { en: "Almond Croissant", ar: "كرواسون باللوز" },
    category: { en: "Croissant", ar: "كرواسون" },
    note: { en: "Laminated layers, toasted almond, soft centre.", ar: "طبقات مورّقة، لوز محمّص، وقلب طري." },
    price: 145,
    image: "so3.png",
  },
  {
    name: { en: "Raspberry Mousse", ar: "موس التوت" },
    category: { en: "Dessert", ar: "الحلويات" },
    note: { en: "Airy raspberry cream on a crisp sablé.", ar: "كريمة توت خفيفة فوق قاعدة سابليه مقرمشة." },
    price: 150,
    image: "so4.png",
  },
  {
    name: { en: "Iced Matcha", ar: "ماتشا مثلجة" },
    category: { en: "Non Coffee", ar: "بدون قهوة" },
    note: { en: "Ceremonial matcha over ice and fresh milk.", ar: "ماتشا على الثلج مع حليب طازج." },
    price: 115,
    image: "so5.png",
  },
  {
    name: { en: "Waffle Ice Cream Tower", ar: "برج الوافل بالآيس كريم" },
    category: { en: "Waffle Towers", ar: "أبراج الوافل" },
    note: { en: "Warm waffle, soft scoops, triple chocolate.", ar: "وافل دافئ، سكوبس طرية، وتريبل شوكولاتة." },
    price: 230,
    image: "so6.png",
  },
  {
    name: { en: "Chocolate Croissant", ar: "كرواسون شوكولاتة" },
    category: { en: "Croissant", ar: "كرواسون" },
    note: { en: "Milk chocolate shell, chocolate pearls.", ar: "غلاف شوكولاتة بالحليب مع حبيبات شوكولاتة." },
    price: 130,
    image: "so7.png",
  },
];

export const CONTACT = {
  phone: "01096781000",
  phoneDisplay: "010 96781000",
  email: "128cafeandbakery@gmail.com",
  maps: "https://maps.app.goo.gl/pENZDJexvXvy8eBt9",
  facebook: "https://www.facebook.com/profile.php?id=61562018675935",
  instagram: "https://www.instagram.com/128cafebakery",
  tiktok: "https://www.tiktok.com/@128cafeandbakery",
  area: { en: "New Damietta — Street 15", ar: "دمياط الجديدة — شارع 15" },
};
