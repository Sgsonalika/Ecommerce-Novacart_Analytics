"""
Full analysis script — produces all charts saved to visuals/ and summary stats to reports/
"""
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
import warnings, os
warnings.filterwarnings('ignore')

VIS = "/home/claude/Ecommerce_Analytics_Project/visuals"
os.makedirs(VIS, exist_ok=True)

# ── Palette ────────────────────────────────────────────────────────────────────
DARK   = "#0D1B2A"
TEAL   = "#0E9AA7"
CORAL  = "#F55D3E"
GOLD   = "#F7B731"
LIGHT  = "#F5F7FA"
GRAY   = "#8892A0"
PALETTE = [TEAL, CORAL, GOLD, "#6C63FF", "#43AA8B", "#F8961E"]
CMAP   = sns.color_palette([TEAL, "#B2EBF2"], as_cmap=False)

plt.rcParams.update({
    "figure.facecolor": LIGHT,
    "axes.facecolor":   LIGHT,
    "axes.edgecolor":   "#D0D7DE",
    "axes.labelcolor":  DARK,
    "xtick.color":      GRAY,
    "ytick.color":      GRAY,
    "text.color":       DARK,
    "font.family":      "DejaVu Sans",
    "axes.spines.top":  False,
    "axes.spines.right":False,
    "axes.grid":        True,
    "grid.color":       "#E4E9EF",
    "grid.linewidth":   0.6,
})

def save(name):
    plt.savefig(f"{VIS}/{name}.png", dpi=150, bbox_inches="tight",
                facecolor=LIGHT)
    plt.close()
    print(f"  saved {name}.png")

# ── Load data ──────────────────────────────────────────────────────────────────
df = pd.read_csv("data/orders.csv", parse_dates=["Order_Date","Ship_Date"])
dc = pd.read_csv("data/customers.csv", parse_dates=["Customer_Since"])

# STEP 3 — Data Cleaning
df.drop_duplicates(subset="Order_ID", inplace=True)
df["Shipping_Cost"].fillna(df["Shipping_Cost"].median(), inplace=True)
# Remove extreme outlier sales (>99.5 percentile)
q995 = df["Sales"].quantile(0.995)
df = df[df["Sales"] <= q995].copy()

# Feature engineering
df["Year"]          = df["Order_Date"].dt.year
df["Month"]         = df["Order_Date"].dt.month
df["MonthName"]     = df["Order_Date"].dt.strftime("%b")
df["Quarter"]       = df["Order_Date"].dt.to_period("Q").astype(str)
df["YearMonth"]     = df["Order_Date"].dt.to_period("M").astype(str)
df["Profit_Margin"] = df["Profit"] / df["Sales"]

# ── KPIs ───────────────────────────────────────────────────────────────────────
total_revenue   = df["Sales"].sum()
total_profit    = df["Profit"].sum()
profit_margin   = total_profit / total_revenue * 100
avg_order_val   = df["Sales"].mean()
return_rate     = df["Returned_Order"].mean() * 100
total_orders    = len(df)

kpis = {
    "Total Revenue (INR)":  f"₹{total_revenue:,.0f}",
    "Total Profit (INR)":   f"₹{total_profit:,.0f}",
    "Overall Profit Margin":f"{profit_margin:.1f}%",
    "Avg Order Value":      f"₹{avg_order_val:,.0f}",
    "Return Rate":          f"{return_rate:.1f}%",
    "Total Orders":         f"{total_orders:,}",
}
print("\n=== KPIs ===")
for k,v in kpis.items(): print(f"  {k}: {v}")

# ── 1. Monthly Revenue Trend ───────────────────────────────────────────────────
print("\n[1] Monthly Revenue Trend")
monthly = df.groupby("YearMonth")[["Sales","Profit"]].sum().reset_index()
monthly = monthly.tail(24)  # last 24 months
fig, ax = plt.subplots(figsize=(12,4.5))
ax.fill_between(range(len(monthly)), monthly["Sales"]/1e5, alpha=0.18, color=TEAL)
ax.plot(range(len(monthly)), monthly["Sales"]/1e5, color=TEAL, lw=2.5, marker="o", ms=4, label="Revenue")
ax.fill_between(range(len(monthly)), monthly["Profit"]/1e5, alpha=0.15, color=CORAL)
ax.plot(range(len(monthly)), monthly["Profit"]/1e5, color=CORAL, lw=2, marker="s", ms=3, label="Profit")
step = max(1, len(monthly)//12)
ax.set_xticks(range(0, len(monthly), step))
ax.set_xticklabels(monthly["YearMonth"].iloc[::step], rotation=45, ha="right", fontsize=8)
ax.set_ylabel("Amount (₹ Lakhs)")
ax.set_title("Monthly Revenue & Profit Trend", fontsize=14, fontweight="bold", pad=12)
ax.legend(frameon=False)
save("01_monthly_revenue_trend")

# ── 2. Revenue by Category ─────────────────────────────────────────────────────
print("[2] Revenue by Category")
cat_rev = df.groupby("Category")[["Sales","Profit"]].sum().sort_values("Sales", ascending=True)
fig, ax = plt.subplots(figsize=(9,4.5))
bars = ax.barh(cat_rev.index, cat_rev["Sales"]/1e5, color=PALETTE[:len(cat_rev)], edgecolor="none", height=0.55)
for bar, profit in zip(bars, cat_rev["Profit"]/1e5):
    ax.text(bar.get_width()+0.5, bar.get_y()+bar.get_height()/2,
            f"₹{bar.get_width():.0f}L", va="center", fontsize=9, color=DARK)
ax.set_xlabel("Revenue (₹ Lakhs)")
ax.set_title("Revenue by Product Category", fontsize=14, fontweight="bold", pad=12)
save("02_revenue_by_category")

# ── 3. Profit Margin by Category ──────────────────────────────────────────────
print("[3] Profit Margin by Category")
cat_pm = df.groupby("Category").apply(lambda x: x["Profit"].sum()/x["Sales"].sum()*100).reset_index()
cat_pm.columns = ["Category","Profit_Margin"]
cat_pm = cat_pm.sort_values("Profit_Margin")
colors = [CORAL if v < 15 else TEAL for v in cat_pm["Profit_Margin"]]
fig, ax = plt.subplots(figsize=(9,4))
bars = ax.barh(cat_pm["Category"], cat_pm["Profit_Margin"], color=colors, height=0.5)
ax.axvline(cat_pm["Profit_Margin"].mean(), color=GOLD, lw=1.5, ls="--", label=f"Avg {cat_pm['Profit_Margin'].mean():.1f}%")
for bar in bars:
    ax.text(bar.get_width()+0.3, bar.get_y()+bar.get_height()/2,
            f"{bar.get_width():.1f}%", va="center", fontsize=9)
ax.set_xlabel("Profit Margin (%)")
ax.set_title("Profit Margin by Category", fontsize=14, fontweight="bold", pad=12)
ax.legend(frameon=False)
save("03_profit_margin_by_category")

# ── 4. Regional Sales Performance ─────────────────────────────────────────────
print("[4] Regional Sales")
reg = df.groupby("Region")[["Sales","Profit"]].sum().reset_index()
reg["Margin"] = reg["Profit"]/reg["Sales"]*100
fig, axes = plt.subplots(1, 2, figsize=(11,4))
axes[0].bar(reg["Region"], reg["Sales"]/1e5, color=PALETTE, edgecolor="none", width=0.5)
axes[0].set_title("Revenue by Region", fontsize=12, fontweight="bold")
axes[0].set_ylabel("Revenue (₹ Lakhs)")
axes[1].bar(reg["Region"], reg["Margin"], color=PALETTE, edgecolor="none", width=0.5)
axes[1].set_title("Profit Margin by Region (%)", fontsize=12, fontweight="bold")
axes[1].set_ylabel("Profit Margin (%)")
for ax in axes:
    for bar in ax.patches:
        ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.3,
                f"{bar.get_height():.1f}", ha="center", fontsize=9)
plt.tight_layout()
save("04_regional_performance")

# ── 5. Customer Segment Analysis ──────────────────────────────────────────────
print("[5] Customer Segment")
merged = df.merge(dc[["Customer_ID","Segment","Age_Group"]], on="Customer_ID", how="left")
seg_rev = merged.groupby("Segment")[["Sales","Profit"]].sum().reset_index()
seg_rev.columns = ["Segment","Sales","Profit"]
seg_rev["Margin"] = seg_rev["Profit"]/seg_rev["Sales"]*100
fig, ax = plt.subplots(figsize=(8,4))
x = np.arange(len(seg_rev))
w = 0.35
b1 = ax.bar(x-w/2, seg_rev["Sales"]/1e5, width=w, color=TEAL, label="Revenue", edgecolor="none")
b2 = ax.bar(x+w/2, seg_rev["Profit"]/1e5, width=w, color=CORAL, label="Profit", edgecolor="none")
ax.set_xticks(x); ax.set_xticklabels(seg_rev["Segment"])
ax.set_ylabel("Amount (₹ Lakhs)")
ax.set_title("Revenue & Profit by Customer Segment", fontsize=14, fontweight="bold", pad=12)
ax.legend(frameon=False)
save("05_customer_segment")

# ── 6. Discount Impact on Profit ──────────────────────────────────────────────
print("[6] Discount vs Profit")
df["Disc_Bucket"] = pd.cut(df["Discount"], bins=[-0.01,0,0.10,0.20,0.30,0.50],
                            labels=["0%","1-10%","11-20%","21-30%","31-50%"])
disc_agg = df.groupby("Disc_Bucket").agg(
    Avg_Profit_Margin=("Profit_Margin","mean"),
    Order_Count=("Order_ID","count"),
    Return_Rate=("Returned_Order","mean")
).reset_index()

fig, ax1 = plt.subplots(figsize=(9,4))
color_list = [TEAL if v > 0 else CORAL for v in disc_agg["Avg_Profit_Margin"]]
ax1.bar(disc_agg["Disc_Bucket"], disc_agg["Avg_Profit_Margin"]*100,
        color=color_list, edgecolor="none", width=0.45, label="Avg Profit Margin %")
ax1.set_ylabel("Avg Profit Margin (%)", color=DARK)
ax1.axhline(0, color=GRAY, lw=0.8, ls="--")
ax2 = ax1.twinx()
ax2.plot(disc_agg["Disc_Bucket"], disc_agg["Return_Rate"]*100,
         color=GOLD, marker="D", lw=2, ms=7, label="Return Rate %")
ax2.set_ylabel("Return Rate (%)", color=GOLD)
ax1.set_title("Discount Impact: Profit Margin vs Return Rate", fontsize=13, fontweight="bold", pad=12)
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1+lines2, labels1+labels2, frameon=False, loc="upper left")
save("06_discount_impact")

# ── 7. Return Rate by Category ────────────────────────────────────────────────
print("[7] Return Rate by Category")
ret = df.groupby("Category").agg(
    Return_Rate=("Returned_Order","mean"),
    Total_Orders=("Order_ID","count")
).reset_index()
ret["Return_Rate"] *= 100
ret = ret.sort_values("Return_Rate", ascending=True)
fig, ax = plt.subplots(figsize=(9,4))
colors = [CORAL if v > 20 else TEAL for v in ret["Return_Rate"]]
ax.barh(ret["Category"], ret["Return_Rate"], color=colors, height=0.5)
ax.axvline(ret["Return_Rate"].mean(), color=GOLD, lw=1.5, ls="--",
           label=f"Avg {ret['Return_Rate'].mean():.1f}%")
for i, v in enumerate(ret["Return_Rate"]):
    ax.text(v+0.3, i, f"{v:.1f}%", va="center", fontsize=9)
ax.set_xlabel("Return Rate (%)")
ax.set_title("Product Return Rate by Category", fontsize=14, fontweight="bold", pad=12)
ax.legend(frameon=False)
save("07_return_rate_by_category")

# ── 8. Shipping Mode Analysis ─────────────────────────────────────────────────
print("[8] Shipping Mode")
ship = df.groupby("Ship_Mode").agg(
    Avg_Delivery=("Delivery_Time","mean"),
    Avg_Ship_Cost=("Shipping_Cost","mean"),
    Order_Count=("Order_ID","count"),
    Return_Rate=("Returned_Order","mean")
).reset_index()
fig, axes = plt.subplots(1,2, figsize=(11,4))
axes[0].bar(ship["Ship_Mode"], ship["Avg_Delivery"], color=PALETTE, edgecolor="none", width=0.5)
axes[0].set_title("Avg Delivery Time by Ship Mode (days)", fontsize=11, fontweight="bold")
axes[0].set_ylabel("Days")
axes[1].bar(ship["Ship_Mode"], ship["Avg_Ship_Cost"], color=PALETTE, edgecolor="none", width=0.5)
axes[1].set_title("Avg Shipping Cost by Ship Mode (₹)", fontsize=11, fontweight="bold")
axes[1].set_ylabel("Shipping Cost (₹)")
for ax in axes:
    for bar in ax.patches:
        ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.1,
                f"{bar.get_height():.1f}", ha="center", fontsize=9)
plt.tight_layout()
save("08_shipping_analysis")

# ── 9. Monthly Seasonal Heatmap ───────────────────────────────────────────────
print("[9] Seasonal Heatmap")
pivot_sales = df.pivot_table(values="Sales", index="Year", columns="Month",
                              aggfunc="sum", fill_value=0)
fig, ax = plt.subplots(figsize=(12,3.5))
month_labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
sns.heatmap(pivot_sales/1e4, annot=True, fmt=".0f", cmap="YlOrRd",
            xticklabels=month_labels[:pivot_sales.shape[1]], ax=ax,
            linewidths=0.5, linecolor="white", cbar_kws={"label":"Revenue (₹ Ten-K)"})
ax.set_title("Monthly Revenue Heatmap (₹ Ten Thousand)", fontsize=13, fontweight="bold", pad=12)
ax.set_xlabel("Month"); ax.set_ylabel("Year")
save("09_seasonal_heatmap")

# ── 10. Top Sub-Categories by Profit ──────────────────────────────────────────
print("[10] Top Sub-Categories")
subcat = df.groupby(["Category","Sub_Category"])[["Sales","Profit"]].sum().reset_index()
subcat["Margin"] = subcat["Profit"]/subcat["Sales"]*100
top10 = subcat.nlargest(10, "Profit")
fig, ax = plt.subplots(figsize=(10,5))
color_map = {c:p for c,p in zip(df["Category"].unique(), PALETTE)}
colors = [color_map.get(c, GRAY) for c in top10["Category"]]
ax.barh(top10["Sub_Category"]+" ("+top10["Category"]+")", top10["Profit"]/1e4,
        color=colors, height=0.6)
ax.set_xlabel("Total Profit (₹ Ten Thousand)")
ax.set_title("Top 10 Sub-Categories by Profit", fontsize=14, fontweight="bold", pad=12)
save("10_top_subcategories")

# ── 11. State-Level Sales Bubble Chart ────────────────────────────────────────
print("[11] State level")
state_agg = df.groupby("State").agg(
    Sales=("Sales","sum"),
    Profit=("Profit","sum"),
    Orders=("Order_ID","count")
).reset_index()
state_agg["Margin"] = state_agg["Profit"]/state_agg["Sales"]*100
fig, ax = plt.subplots(figsize=(10,5))
scatter = ax.scatter(state_agg["Sales"]/1e4, state_agg["Margin"],
                     s=state_agg["Orders"]*2, alpha=0.7,
                     c=state_agg["Margin"], cmap="RdYlGn", edgecolors="white", lw=0.5)
for _, row in state_agg.iterrows():
    ax.annotate(row["State"], (row["Sales"]/1e4, row["Margin"]),
                fontsize=8, ha="center", va="bottom", color=DARK)
ax.axhline(state_agg["Margin"].mean(), color=GRAY, ls="--", lw=1)
ax.set_xlabel("Total Sales (₹ Ten Thousand)")
ax.set_ylabel("Profit Margin (%)")
ax.set_title("State Performance: Sales vs Profit Margin\n(Bubble size = Order Volume)",
             fontsize=13, fontweight="bold", pad=12)
plt.colorbar(scatter, label="Profit Margin %")
save("11_state_bubble_chart")

# ── 12. Customer Lifetime Value Distribution ──────────────────────────────────
print("[12] LTV Distribution")
fig, ax = plt.subplots(figsize=(9,4))
ax.hist(dc["Lifetime_Value"], bins=40, color=TEAL, edgecolor="white", alpha=0.85)
ax.axvline(dc["Lifetime_Value"].median(), color=CORAL, lw=2, ls="--",
           label=f"Median ₹{dc['Lifetime_Value'].median():,.0f}")
ax.axvline(dc["Lifetime_Value"].mean(), color=GOLD, lw=2, ls="-.",
           label=f"Mean ₹{dc['Lifetime_Value'].mean():,.0f}")
ax.set_xlabel("Customer Lifetime Value (₹)")
ax.set_ylabel("Number of Customers")
ax.set_title("Customer Lifetime Value Distribution", fontsize=14, fontweight="bold", pad=12)
ax.legend(frameon=False)
save("12_ltv_distribution")

# ── 13. Quarterly Revenue Trend ───────────────────────────────────────────────
print("[13] Quarterly Trend")
q_rev = df.groupby("Quarter")[["Sales","Profit"]].sum().reset_index()
q_rev = q_rev.sort_values("Quarter").tail(8)
fig, ax = plt.subplots(figsize=(10,4))
x = range(len(q_rev))
ax.bar([i-0.2 for i in x], q_rev["Sales"]/1e5, width=0.35, color=TEAL, label="Revenue", edgecolor="none")
ax.bar([i+0.2 for i in x], q_rev["Profit"]/1e5, width=0.35, color=CORAL, label="Profit", edgecolor="none")
ax.set_xticks(list(x)); ax.set_xticklabels(q_rev["Quarter"], rotation=30, ha="right")
ax.set_ylabel("Amount (₹ Lakhs)")
ax.set_title("Quarterly Revenue & Profit", fontsize=14, fontweight="bold", pad=12)
ax.legend(frameon=False)
save("13_quarterly_trend")

# ── 14. KPI Summary Dashboard ─────────────────────────────────────────────────
print("[14] KPI Dashboard")
fig, axes = plt.subplots(2, 3, figsize=(14, 6))
fig.patch.set_facecolor(DARK)
kpi_data = [
    ("Total Revenue", f"₹{total_revenue/1e7:.1f} Cr", TEAL),
    ("Total Profit",  f"₹{total_profit/1e6:.1f} L",   "#43AA8B"),
    ("Profit Margin", f"{profit_margin:.1f}%",          GOLD),
    ("Avg Order Value",f"₹{avg_order_val:,.0f}",       "#6C63FF"),
    ("Return Rate",   f"{return_rate:.1f}%",            CORAL),
    ("Total Orders",  f"{total_orders:,}",              "#F8961E"),
]
for ax, (title, value, color) in zip(axes.flat, kpi_data):
    ax.set_facecolor(DARK)
    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values(): spine.set_visible(False)
    ax.text(0.5, 0.62, value, ha="center", va="center", fontsize=26,
            fontweight="bold", color=color, transform=ax.transAxes)
    ax.text(0.5, 0.28, title, ha="center", va="center", fontsize=11,
            color="white", transform=ax.transAxes)
    ax.add_patch(plt.Rectangle((0.05,0.05),0.9,0.9, transform=ax.transAxes,
                                fill=False, edgecolor=color, lw=1.5, alpha=0.5))
plt.suptitle("NOVA CART — Key Performance Indicators", fontsize=16,
             fontweight="bold", color="white", y=1.01)
plt.tight_layout()
save("14_kpi_dashboard")

print("\n✅ All 14 charts saved to visuals/")

# ── Export Summary Stats ───────────────────────────────────────────────────────
os.makedirs("reports", exist_ok=True)
summary = pd.DataFrame([kpis]).T.reset_index()
summary.columns = ["Metric","Value"]
summary.to_csv("reports/kpi_summary.csv", index=False)
#summary.to_csv("/home/claude/Ecommerce_Analytics_Project/reports/kpi_summary.csv", index=False)

cat_rev.reset_index().to_csv("reports/category_analysis.csv")
reg.to_csv("reports/regional_analysis.csv", index=False)
print("✅ Summary reports saved to reports/")
