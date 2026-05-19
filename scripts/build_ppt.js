const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ── Palette ────────────────────────────────────────────────────────────────────
const DARK   = "0D1B2A";
const TEAL   = "0E9AA7";
const CORAL  = "F55D3E";
const GOLD   = "F7B731";
const WHITE  = "FFFFFF";
const LIGHT  = "F5F7FA";
const GRAY   = "8892A0";
const NAVY   = "0A2540";
const MINT   = "43AA8B";
const PURPLE = "6C63FF";

const VIS = "visuals";
const OUT = "presentation/NovaCart_Analytics_Deck.pptx";

function makeShadow() {
  return { type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 };
}

// ── Helper: add a dark-bg slide ────────────────────────────────────────────────
function darkSlide(pres) {
  const s = pres.addSlide();
  s.background = { color: DARK };
  return s;
}

// ── Helper: stat card ──────────────────────────────────────────────────────────
function addStatCard(slide, x, y, w, h, value, label, accent) {
  slide.addShape(slide.pres ? slide.pres.shapes.RECTANGLE : pptxgen.shapes?.RECTANGLE, {
    x, y, w, h,
    fill: { color: NAVY },
    line: { color: accent, width: 1 },
    shadow: makeShadow(),
  });
  slide.addText(value, {
    x: x+0.1, y: y+0.08, w: w-0.2, h: h*0.55,
    fontSize: 22, bold: true, color: accent,
    align: "center", valign: "middle",
  });
  slide.addText(label, {
    x: x+0.1, y: y+h*0.55, w: w-0.2, h: h*0.42,
    fontSize: 9, color: "B0C4D0",
    align: "center", valign: "top",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author  = "NovaCart Analytics Team";
pres.title   = "E-Commerce Sales & Customer Intelligence Analytics";

// Attach reference so addStatCard can use shapes
// We'll inline addShape calls directly instead.

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  // Left accent bar
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.35, h:5.625, fill:{ color: TEAL }, line:{ color: TEAL } });

  // Decorative circles
  s.addShape(pres.shapes.OVAL, { x:7.8, y:-0.5, w:3.5, h:3.5, fill:{ color: TEAL, transparency:88 }, line:{ color: TEAL, width:0 } });
  s.addShape(pres.shapes.OVAL, { x:8.8, y:2.8, w:2.2, h:2.2, fill:{ color: CORAL, transparency:85 }, line:{ color: CORAL, width:0 } });

  // Company tag
  s.addShape(pres.shapes.RECTANGLE, { x:0.55, y:0.7, w:2.8, h:0.32, fill:{ color: TEAL }, line:{ color: TEAL } });
  s.addText("NOVACART INDIA PVT. LTD.", { x:0.55, y:0.7, w:2.8, h:0.32, fontSize:8, bold:true, color:WHITE, align:"center", valign:"middle" });

  // Title
  s.addText("E-Commerce Sales &", { x:0.55, y:1.25, w:7.5, h:0.75, fontSize:34, bold:true, color:WHITE, fontFace:"Georgia" });
  s.addText("Customer Intelligence", { x:0.55, y:1.95, w:7.5, h:0.75, fontSize:34, bold:true, color:TEAL, fontFace:"Georgia" });
  s.addText("Analytics", { x:0.55, y:2.65, w:7.5, h:0.75, fontSize:34, bold:true, color:WHITE, fontFace:"Georgia" });

  // Subtitle
  s.addText("A Complete End-to-End Business Case Study  |  FY 2023–2025", {
    x:0.55, y:3.55, w:7.2, h:0.35, fontSize:13, color:"B0D4DC", italic:true
  });

  // Meta row
  s.addShape(pres.shapes.LINE, { x:0.55, y:4.1, w:6.5, h:0, line:{ color:"2A4A60", width:1 } });
  s.addText("📦 12,000+ Orders   |   👥 1,500 Customers   |   🗂 5 Categories   |   📍 4 Regions", {
    x:0.55, y:4.2, w:8.5, h:0.35, fontSize:9.5, color:GRAY, align:"left"
  });

  // Bottom credit
  s.addText("Data Analytics Team  |  May 2025", {
    x:0.55, y:5.15, w:5, h:0.25, fontSize:8, color:"4A6878"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Company Introduction
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: NAVY }, line:{ color: NAVY } });
  s.addText("COMPANY OVERVIEW", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  s.addText("NovaCart India Pvt. Ltd.", { x:0.4, y:0.95, w:9, h:0.7, fontSize:26, bold:true, color:NAVY, fontFace:"Georgia" });
  s.addText("Mid-sized e-commerce marketplace founded in Bengaluru (2019). Serving Consumers, Corporates &\nHome Office customers across India through a B2C/B2B hybrid model.", {
    x:0.4, y:1.6, w:5.8, h:0.9, fontSize:11, color:DARK, lineSpacingMultiple:1.4
  });

  // 5 category cards
  const cats = [
    { name:"Technology",     icon:"💻", color:TEAL   },
    { name:"Furniture",      icon:"🪑", color:CORAL  },
    { name:"Office Supplies",icon:"📎", color:GOLD   },
    { name:"Clothing",       icon:"👗", color:PURPLE },
    { name:"Home & Kitchen", icon:"🍳", color:MINT   },
  ];
  cats.forEach((c, i) => {
    const x = 0.4 + i * 1.85;
    s.addShape(pres.shapes.RECTANGLE, { x, y:2.7, w:1.65, h:1.5, fill:{ color: c.color }, line:{ color: c.color }, shadow: makeShadow() });
    s.addText(c.icon,  { x, y:2.75, w:1.65, h:0.6, fontSize:22, align:"center", valign:"middle" });
    s.addText(c.name,  { x, y:3.35, w:1.65, h:0.75, fontSize:9, bold:true, color:WHITE, align:"center", valign:"middle" });
  });

  // Right info panel
  s.addShape(pres.shapes.RECTANGLE, { x:6.45, y:0.92, w:3.15, h:1.6, fill:{ color:"EEF6F8" }, line:{ color:"C8DFE4", width:1 } });
  s.addText([
    { text:"📍 Headquarter: ", options:{ bold:true } }, { text:"Bengaluru, India\n" },
    { text:"🗓 Founded: ",     options:{ bold:true } }, { text:"2019\n" },
    { text:"🌏 Operations: ",  options:{ bold:true } }, { text:"North, South, East, West\n" },
    { text:"🎯 Customers: ",   options:{ bold:true } }, { text:"Consumer · Corporate · Home Office" },
  ], { x:6.6, y:0.98, w:2.85, h:1.45, fontSize:9.5, color:DARK, lineSpacingMultiple:1.6 });

  // Challenges
  s.addShape(pres.shapes.RECTANGLE, { x:0.4, y:4.35, w:9.2, h:1.0, fill:{ color:"FFF3F0" }, line:{ color: CORAL, width:1 } });
  s.addText("⚠  Key Business Challenges:", { x:0.55, y:4.38, w:3, h:0.3, fontSize:9, bold:true, color:CORAL });
  s.addText("Fluctuating Revenue  ·  Margin Erosion from Discounts  ·  ~20% Return Rate  ·  East Region Underperformance  ·  40% One-Time Buyers", {
    x:0.55, y:4.68, w:8.9, h:0.55, fontSize:9, color:DARK, align:"left"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Dataset Overview
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: NAVY }, line:{ color: NAVY } });
  s.addText("DATASET OVERVIEW", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  // Orders table
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:0.9, w:4.5, h:4.5, fill:{ color: WHITE }, line:{ color:"D0D7DE", width:1 }, shadow: makeShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:0.9, w:4.5, h:0.45, fill:{ color: TEAL }, line:{ color: TEAL } });
  s.addText("📦 ORDERS TABLE  —  12,050 rows", { x:0.45, y:0.9, w:4.3, h:0.45, fontSize:10, bold:true, color:WHITE, valign:"middle" });

  const oFields = ["Order_ID","Order_Date / Ship_Date","Customer_ID / Product_ID","Category / Sub_Category","Region / State / City","Sales / Profit / Discount","Quantity / Shipping_Cost","Delivery_Time","Returned_Order (Flag)"];
  oFields.forEach((f,i) => {
    const y = 1.45 + i * 0.38;
    if (i % 2 === 0) s.addShape(pres.shapes.RECTANGLE, { x:0.35, y, w:4.5, h:0.38, fill:{ color:"F0F8FA" }, line:{ color:"F0F8FA" } });
    s.addText(f, { x:0.55, y: y+0.05, w:4.1, h:0.28, fontSize:9.5, color:DARK });
  });

  // Customers table
  s.addShape(pres.shapes.RECTANGLE, { x:5.15, y:0.9, w:4.5, h:4.5, fill:{ color: WHITE }, line:{ color:"D0D7DE", width:1 }, shadow: makeShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:5.15, y:0.9, w:4.5, h:0.45, fill:{ color: CORAL }, line:{ color: CORAL } });
  s.addText("👥 CUSTOMERS TABLE  —  1,500 rows", { x:5.25, y:0.9, w:4.3, h:0.45, fontSize:10, bold:true, color:WHITE, valign:"middle" });

  const cFields = ["Customer_ID","Customer_Name","Segment (Consumer / Corporate / HO)","Age_Group (18-25 to 55+)","Gender","Customer_Since (Date)","Total_Orders (Count)","Lifetime_Value (₹)"];
  cFields.forEach((f,i) => {
    const y = 1.45 + i * 0.42;
    if (i % 2 === 0) s.addShape(pres.shapes.RECTANGLE, { x:5.15, y, w:4.5, h:0.42, fill:{ color:"FFF5F3" }, line:{ color:"FFF5F3" } });
    s.addText(f, { x:5.35, y: y+0.06, w:4.1, h:0.3, fontSize:9.5, color:DARK });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — KPI Dashboard
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addText("KEY PERFORMANCE INDICATORS", { x:0.4, y:0.2, w:9.2, h:0.5, fontSize:11, bold:true, color:WHITE, align:"center", charSpacing:4 });
  s.addText("NovaCart India — FY2023–2025 Consolidated Performance", {
    x:0.4, y:0.65, w:9.2, h:0.3, fontSize:10, color:"7A9AB0", align:"center", italic:true
  });

  const kpis = [
    { v:"₹98.5L",   l:"Total Revenue",    c:TEAL   },
    { v:"₹20.0L",   l:"Total Profit",     c:MINT   },
    { v:"20.3%",    l:"Profit Margin",    c:GOLD   },
    { v:"₹825",     l:"Avg Order Value",  c:PURPLE },
    { v:"19.8%",    l:"Return Rate ⚠",   c:CORAL  },
    { v:"11,940",   l:"Total Orders",     c:"F8961E"},
  ];

  kpis.forEach((k, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 0.4 + col * 3.1;
    const y = 1.1 + row * 2.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:2.8, h:1.7, fill:{ color:"0A2540" }, line:{ color:k.c, width:1.5 }, shadow: makeShadow() });
    s.addText(k.v, { x, y:y+0.2, w:2.8, h:0.9, fontSize:30, bold:true, color:k.c, align:"center", valign:"middle", fontFace:"Georgia" });
    s.addText(k.l, { x, y:y+1.1, w:2.8, h:0.5, fontSize:10, color:"B0C4D0", align:"center" });
  });

  s.addText("Data Period: Jan 2023 — May 2025  |  Orders Table + Customer Table", {
    x:0.4, y:5.2, w:9.2, h:0.25, fontSize:8, color:"3A5A70", align:"center"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Revenue Analysis
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: TEAL }, line:{ color: TEAL } });
  s.addText("REVENUE ANALYSIS", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  // Chart image
  if (fs.existsSync(`${VIS}/01_monthly_revenue_trend.png`)) {
    s.addImage({ path:`${VIS}/01_monthly_revenue_trend.png`, x:0.35, y:0.85, w:9.3, h:3.3 });
  }

  // Insights below
  const insights = [
    { icon:"📈", text:"Oct–Dec peaks: Festive season drives 35% of annual revenue" },
    { icon:"📉", text:"February is consistently the weakest month every year" },
    { icon:"⚡", text:"Q3 FY2025 shows strongest YoY growth (+18%)" },
  ];
  insights.forEach((ins, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.35+i*3.22, y:4.3, w:3.0, h:1.0, fill:{ color: WHITE }, line:{ color:"D0D7DE", width:1 }, shadow: makeShadow() });
    s.addText(ins.icon+" "+ins.text, { x:0.45+i*3.22, y:4.35, w:2.8, h:0.9, fontSize:9, color:DARK, lineSpacingMultiple:1.4 });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Category & Profit Analysis
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: NAVY }, line:{ color: NAVY } });
  s.addText("CATEGORY & PROFIT ANALYSIS", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  if (fs.existsSync(`${VIS}/02_revenue_by_category.png`)) {
    s.addImage({ path:`${VIS}/02_revenue_by_category.png`, x:0.3, y:0.85, w:4.6, h:2.8 });
  }
  if (fs.existsSync(`${VIS}/03_profit_margin_by_category.png`)) {
    s.addImage({ path:`${VIS}/03_profit_margin_by_category.png`, x:5.1, y:0.85, w:4.6, h:2.8 });
  }

  // Key finding box
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:3.82, w:9.3, h:1.55, fill:{ color:"FFF8EC" }, line:{ color:GOLD, width:1.5 } });
  s.addText("🔑  KEY FINDING", { x:0.55, y:3.87, w:2.5, h:0.3, fontSize:9, bold:true, color:GOLD });
  s.addText([
    { text:"Technology", options:{ bold:true, color:TEAL } },
    { text:" leads in revenue (₹32L) but has the lowest margin (~14%).  " },
    { text:"Clothing", options:{ bold:true, color:CORAL } },
    { text:" has the highest margin (~45%) but is under-invested.\n" },
    { text:"Recommendation: ", options:{ bold:true, color:NAVY } },
    { text:"Shift 20% of Technology marketing budget to Clothing & Home & Kitchen to improve blended margin." },
  ], { x:0.55, y:4.2, w:9.0, h:1.1, fontSize:9.5, color:DARK, lineSpacingMultiple:1.5 });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Discount Impact
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: CORAL }, line:{ color: CORAL } });
  s.addText("DISCOUNT IMPACT ANALYSIS", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  if (fs.existsSync(`${VIS}/06_discount_impact.png`)) {
    s.addImage({ path:`${VIS}/06_discount_impact.png`, x:0.3, y:0.85, w:9.4, h:3.1 });
  }

  // Callout cards
  const cards = [
    { pct:"0%",     margin:"+22%", label:"No discount — healthy margin", c:MINT  },
    { pct:"11–20%", margin:"+15%", label:"Moderate — acceptable margin", c:GOLD  },
    { pct:"31–50%", margin:"LOSS", label:"Deep discount — destroys profit", c:CORAL },
  ];
  cards.forEach((c, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.35+i*3.22, y:4.1, w:3.0, h:1.25, fill:{ color: WHITE }, line:{ color:c.c, width:2 }, shadow: makeShadow() });
    s.addText("Discount "+c.pct, { x:0.45+i*3.22, y:4.12, w:2.8, h:0.32, fontSize:9, bold:true, color:c.c });
    s.addText("Avg Margin: "+c.margin, { x:0.45+i*3.22, y:4.44, w:2.8, h:0.4, fontSize:14, bold:true, color:DARK, align:"center" });
    s.addText(c.label, { x:0.45+i*3.22, y:4.85, w:2.8, h:0.45, fontSize:8.5, color:GRAY, align:"center" });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Regional Analysis
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: NAVY }, line:{ color: NAVY } });
  s.addText("REGIONAL PERFORMANCE", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  if (fs.existsSync(`${VIS}/04_regional_performance.png`)) {
    s.addImage({ path:`${VIS}/04_regional_performance.png`, x:0.3, y:0.85, w:9.4, h:3.0 });
  }

  // Regional score cards
  const regions = [
    { name:"North 🥇", rev:"₹32L", margin:"21.4%", c:TEAL  },
    { name:"West 🥇",  rev:"₹31L", margin:"20.8%", c:TEAL  },
    { name:"South",    rev:"₹22L", margin:"19.2%", c:GOLD  },
    { name:"East ⚠",   rev:"₹18L", margin:"18.1%", c:CORAL },
  ];
  regions.forEach((r, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.35+i*2.4, y:4.0, w:2.2, h:1.4, fill:{ color: WHITE }, line:{ color:r.c, width:1.5 }, shadow: makeShadow() });
    s.addText(r.name, { x:0.45+i*2.4, y:4.05, w:2.0, h:0.3, fontSize:9, bold:true, color:r.c, align:"center" });
    s.addText(r.rev,  { x:0.45+i*2.4, y:4.38, w:2.0, h:0.42, fontSize:18, bold:true, color:DARK, align:"center" });
    s.addText("Margin: "+r.margin, { x:0.45+i*2.4, y:4.82, w:2.0, h:0.35, fontSize:9, color:GRAY, align:"center" });
  });

  s.addText("⚠  East region requires an expansion strategy — lowest revenue share AND lowest profit margin", {
    x:0.35, y:5.32, w:9.3, h:0.22, fontSize:8.5, color:CORAL, italic:true, align:"center"
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Customer Analysis
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: PURPLE }, line:{ color: PURPLE } });
  s.addText("CUSTOMER INTELLIGENCE", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  if (fs.existsSync(`${VIS}/05_customer_segment.png`)) {
    s.addImage({ path:`${VIS}/05_customer_segment.png`, x:0.3, y:0.85, w:5.5, h:2.8 });
  }
  if (fs.existsSync(`${VIS}/12_ltv_distribution.png`)) {
    s.addImage({ path:`${VIS}/12_ltv_distribution.png`, x:5.8, y:0.85, w:3.9, h:2.8 });
  }

  // Retention callout
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:3.82, w:4.3, h:1.55, fill:{ color:"FFF3F0" }, line:{ color:CORAL, width:1.5 } });
  s.addText("🔄  RETENTION PROBLEM", { x:0.55, y:3.87, w:4.0, h:0.32, fontSize:9, bold:true, color:CORAL });
  s.addText("~40% of customers are one-time buyers.\nRecover 10% → adds ₹6–8L in annual revenue.", {
    x:0.55, y:4.22, w:4.0, h:1.05, fontSize:10, color:DARK, lineSpacingMultiple:1.5
  });

  s.addShape(pres.shapes.RECTANGLE, { x:4.85, y:3.82, w:4.8, h:1.55, fill:{ color:"EEF6F8" }, line:{ color:TEAL, width:1.5 } });
  s.addText("💼  CORPORATE OPPORTUNITY", { x:5.05, y:3.87, w:4.4, h:0.32, fontSize:9, bold:true, color:TEAL });
  s.addText("Corporate segment: highest LTV & lowest return rate.\nB2B channel expansion = highest-ROI growth lever.", {
    x:5.05, y:4.22, w:4.4, h:1.05, fontSize:10, color:DARK, lineSpacingMultiple:1.5
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Return Rate & Shipping
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color:"B85042" }, line:{ color:"B85042" } });
  s.addText("RETURN RATE & SHIPPING ANALYSIS", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  if (fs.existsSync(`${VIS}/07_return_rate_by_category.png`)) {
    s.addImage({ path:`${VIS}/07_return_rate_by_category.png`, x:0.3, y:0.85, w:4.6, h:2.5 });
  }
  if (fs.existsSync(`${VIS}/08_shipping_analysis.png`)) {
    s.addImage({ path:`${VIS}/08_shipping_analysis.png`, x:5.1, y:0.85, w:4.6, h:2.5 });
  }

  // Key stats
  const stats = [
    { v:"19.8%", l:"Overall Return Rate\n(Benchmark: 12–14%)", c:CORAL },
    { v:"₹10L+", l:"Est. Annual Reverse\nLogistics Cost",      c:"B85042" },
    { v:"+30%",  l:"Return rate at\n>30% discount tiers",      c:GOLD  },
    { v:"5–12d", l:"Economy shipping\ndelivery range",         c:GRAY  },
  ];
  stats.forEach((st, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.35+i*2.4, y:3.5, w:2.2, h:1.85, fill:{ color: WHITE }, line:{ color:st.c, width:1.5 }, shadow: makeShadow() });
    s.addText(st.v, { x:0.45+i*2.4, y:3.62, w:2.0, h:0.75, fontSize:24, bold:true, color:st.c, align:"center", fontFace:"Georgia" });
    s.addText(st.l, { x:0.45+i*2.4, y:4.38, w:2.0, h:0.8, fontSize:8.5, color:GRAY, align:"center", lineSpacingMultiple:1.4 });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — Seasonal & Product Insights
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: MINT }, line:{ color: MINT } });
  s.addText("SEASONAL PATTERNS & PRODUCT INSIGHTS", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:2 });

  if (fs.existsSync(`${VIS}/09_seasonal_heatmap.png`)) {
    s.addImage({ path:`${VIS}/09_seasonal_heatmap.png`, x:0.3, y:0.85, w:9.4, h:2.4 });
  }
  if (fs.existsSync(`${VIS}/10_top_subcategories.png`)) {
    s.addImage({ path:`${VIS}/10_top_subcategories.png`, x:0.3, y:3.35, w:9.4, h:2.05 });
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Key Findings
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addText("KEY FINDINGS", { x:0.4, y:0.2, w:9.2, h:0.5, fontSize:11, bold:true, color:WHITE, align:"center", charSpacing:4 });

  const findings = [
    { n:"01", title:"Discount Crisis",      body:"31–50% discounts produce NEGATIVE average profit margins. We are paying customers to buy.", c:CORAL  },
    { n:"02", title:"East Region Gap",      body:"East contributes <20% of revenue with lowest margins. Structural gap in distribution.",    c:GOLD   },
    { n:"03", title:"Retention Problem",    body:"40% one-time buyers. Every recovered customer = ₹825 avg order value opportunity.",        c:PURPLE },
    { n:"04", title:"Category Imbalance",   body:"Clothing (45% margin) receives less investment than Technology (14% margin).",             c:TEAL   },
    { n:"05", title:"Seasonal Dependency",  body:"35% of revenue concentrated in Oct–Dec. Any festive disruption is catastrophic.",         c:MINT   },
    { n:"06", title:"Corporate Upside",     body:"Corporate LTV is 40% higher than Consumer. B2B channel is massively underdeveloped.",      c:"F8961E"},
  ];

  findings.forEach((f, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 0.35 + col * 3.12;
    const y = 0.9 + row * 2.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:2.9, h:1.9, fill:{ color:"0A2540" }, line:{ color:f.c, width:1 }, shadow: makeShadow() });
    s.addShape(pres.shapes.OVAL,      { x:x+0.15, y:y+0.12, w:0.45, h:0.45, fill:{ color:f.c }, line:{ color:f.c } });
    s.addText(f.n, { x:x+0.15, y:y+0.12, w:0.45, h:0.45, fontSize:10, bold:true, color:WHITE, align:"center", valign:"middle" });
    s.addText(f.title, { x:x+0.7,  y:y+0.1,  w:2.1, h:0.4, fontSize:10, bold:true, color:f.c });
    s.addText(f.body,  { x:x+0.15, y:y+0.6,  w:2.65, h:1.2, fontSize:8.5, color:"B0C4D0", lineSpacingMultiple:1.45 });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — Recommendations
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: GOLD }, line:{ color: GOLD } });
  s.addText("STRATEGIC RECOMMENDATIONS", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:DARK, align:"left", valign:"middle", charSpacing:3 });

  const recs = [
    { num:"1", title:"Discount Governance",     body:"Cap max discount at 20%. Require CFO approval above threshold.\nExpected: +₹15–20L annual profit.",   c:CORAL, impact:"HIGH" },
    { num:"2", title:"NovaCart Plus Loyalty",   body:"Launch tiered loyalty (Silver/Gold). Convert 10% one-time → repeat.\nExpected: +₹6–8L revenue.",      c:TEAL,  impact:"HIGH" },
    { num:"3", title:"East Region Push",        body:"Partner with regional logistics. Targeted marketing in 3 key cities.\nExpected: +15% East revenue.",    c:GOLD,  impact:"MED"  },
    { num:"4", title:"B2B Corporate Channel",   body:"Assign KAMs, bulk pricing catalogue, GST automation.\nExpected: +25–35% Corporate revenue.",           c:PURPLE,impact:"HIGH" },
    { num:"5", title:"Category Mix Shift",      body:"Increase Clothing SKUs +40%. Reduce Tech markdowns.\nExpected: Blended margin 20% → 24%.",             c:MINT,  impact:"MED"  },
    { num:"6", title:"Return Reduction",        body:"360° product images, 7-day try for Clothing, smart discount gates.\nExpected: Return rate → 14–15%.",   c:"F8961E",impact:"MED"},
  ];

  recs.forEach((r, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 0.35 + col * 4.85;
    const y = 0.9 + row * 1.55;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.6, h:1.4, fill:{ color: WHITE }, line:{ color:r.c, width:1.5 }, shadow: makeShadow() });
    // Impact badge
    const badgeColor = r.impact === "HIGH" ? CORAL : GOLD;
    s.addShape(pres.shapes.RECTANGLE, { x:x+3.9, y:y+0.08, w:0.65, h:0.28, fill:{ color:badgeColor }, line:{ color:badgeColor } });
    s.addText(r.impact, { x:x+3.9, y:y+0.08, w:0.65, h:0.28, fontSize:7, bold:true, color:WHITE, align:"center", valign:"middle" });
    s.addText(r.num+".  "+r.title, { x:x+0.15, y:y+0.1,  w:3.6, h:0.36, fontSize:11, bold:true, color:r.c });
    s.addText(r.body, { x:x+0.15, y:y+0.5,  w:4.3, h:0.82, fontSize:8.5, color:DARK, lineSpacingMultiple:1.5 });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — Conclusion
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.75, fill:{ color: TEAL }, line:{ color: TEAL } });
  s.addText("CONCLUSION & NEXT STEPS", { x:0.4, y:0, w:9, h:0.75, fontSize:11, bold:true, color:WHITE, align:"left", valign:"middle", charSpacing:3 });

  s.addText("Turning Data into Decisions", { x:0.4, y:0.95, w:9.2, h:0.6, fontSize:22, bold:true, color:WHITE, align:"center", fontFace:"Georgia" });
  s.addText("NovaCart has strong revenue fundamentals — the path to 25%+ margins is clear.", {
    x:0.4, y:1.55, w:9.2, h:0.4, fontSize:11, color:"7AB0C0", align:"center", italic:true
  });

  const steps = [
    { q:"Q3 2025", action:"Implement discount governance framework + cap at 20%",              c:CORAL  },
    { q:"Q3 2025", action:"Launch NovaCart Plus loyalty programme (Silver/Gold tiers)",        c:TEAL   },
    { q:"Q4 2025", action:"Assign 3 corporate KAMs + launch B2B pricing catalogue",           c:PURPLE },
    { q:"Q1 2026", action:"Increase Clothing catalogue by 40 SKUs + reduce Tech ad spend",    c:MINT   },
    { q:"Q1 2026", action:"East region logistics partnership + awareness campaign",             c:GOLD   },
    { q:"Q2 2026", action:"Review and measure: target 24% blended margin & <15% return rate", c:"F8961E"},
  ];

  steps.forEach((st, i) => {
    const y = 2.15 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, { x:0.35, y, w:1.0, h:0.38, fill:{ color:st.c }, line:{ color:st.c } });
    s.addText(st.q,    { x:0.35, y, w:1.0, h:0.38, fontSize:8, bold:true, color:WHITE, align:"center", valign:"middle" });
    s.addText("→  "+st.action, { x:1.5, y:y+0.03, w:8.15, h:0.3, fontSize:9.5, color:"D0E8EE" });
  });

  s.addShape(pres.shapes.LINE, { x:0.35, y:5.12, w:9.3, h:0, line:{ color:"1E3A50", width:1 } });
  s.addText("NovaCart Analytics Team  |  Data-Driven Growth  |  May 2025", {
    x:0.35, y:5.2, w:9.3, h:0.28, fontSize:8, color:"3A5A70", align:"center"
  });
}

// ── Write File ─────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: OUT })
  .then(() => console.log("✅ PPT saved:", OUT))
  .catch(err => { console.error("❌ Error:", err); process.exit(1); });
