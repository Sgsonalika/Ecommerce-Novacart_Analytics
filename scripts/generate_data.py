import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

fake = Faker()
np.random.seed(42)
random.seed(42)

CATEGORIES = {
    "Technology":     {"subcats": ["Laptops","Smartphones","Tablets","Accessories","Monitors"],
                       "price_range": (150, 2500), "margin": (0.12, 0.28)},
    "Furniture":      {"subcats": ["Chairs","Desks","Shelving","Sofas","Beds"],
                       "price_range": (80, 1200),  "margin": (0.05, 0.18)},
    "Office Supplies":{"subcats": ["Binders","Paper","Pens","Labels","Staplers"],
                       "price_range": (5, 120),    "margin": (0.25, 0.48)},
    "Clothing":       {"subcats": ["Mens Wear","Womens Wear","Footwear","Accessories","Sports"],
                       "price_range": (20, 350),   "margin": (0.35, 0.60)},
    "Home & Kitchen": {"subcats": ["Cookware","Bedding","Bath","Decor","Storage"],
                       "price_range": (15, 450),   "margin": (0.20, 0.42)},
}

REGIONS = {
    "North": ["Delhi","Chandigarh","Jaipur","Lucknow","Amritsar"],
    "South": ["Bengaluru","Chennai","Hyderabad","Kochi","Coimbatore"],
    "East":  ["Kolkata","Bhubaneswar","Patna","Guwahati","Ranchi"],
    "West":  ["Mumbai","Pune","Ahmedabad","Surat","Nagpur"],
}

SEGMENTS   = ["Consumer","Corporate","Home Office"]
AGE_GROUPS = ["18-25","26-35","36-45","46-55","55+"]
GENDERS    = ["Male","Female","Non-binary"]
SHIP_MODES = ["Standard","Express","Same-Day","Economy"]
SHIP_DAYS  = {"Standard":(3,7),"Express":(1,3),"Same-Day":(0,1),"Economy":(5,12)}

N_CUSTOMERS = 1500
customer_ids = [f"CUST-{str(i).zfill(5)}" for i in range(1, N_CUSTOMERS+1)]

customers = []
for cid in customer_ids:
    seg   = random.choice(SEGMENTS)
    since = fake.date_between(start_date="-5y", end_date="-6m")
    orders_count = np.random.negative_binomial(3, 0.25) + 1
    ltv   = round(orders_count * np.random.uniform(80, 600), 2)
    customers.append({
        "Customer_ID":    cid,
        "Customer_Name":  fake.name(),
        "Segment":        seg,
        "Age_Group":      random.choice(AGE_GROUPS),
        "Gender":         random.choice(GENDERS),
        "Customer_Since": since,
        "Total_Orders":   orders_count,
        "Lifetime_Value": ltv,
    })

df_customers = pd.DataFrame(customers)

# Build product catalogue
products = []
prod_id = 1
for cat, info in CATEGORIES.items():
    for sub in info["subcats"]:
        for _ in range(12):
            products.append({
                "Product_ID":   f"PROD-{prod_id:04d}",
                "Category":     cat,
                "Sub_Category": sub,
                "Product_Name": f"{fake.word().title()} {sub.split()[0]} {random.randint(100,999)}",
                "price_range":  info["price_range"],
                "margin":       info["margin"],
            })
            prod_id += 1

N_ORDERS = 12000
orders = []
for i in range(N_ORDERS):
    cust   = random.choice(customers)
    prod   = random.choice(products)
    region = random.choices(list(REGIONS.keys()), weights=[0.30,0.20,0.20,0.30])[0]
    state  = random.choice(REGIONS[region])

    order_date = fake.date_between(start_date="-2y", end_date="today")
    ship_mode  = random.choices(SHIP_MODES, weights=[0.45,0.25,0.10,0.20])[0]
    ship_days  = random.randint(*SHIP_DAYS[ship_mode])
    ship_date  = order_date + timedelta(days=ship_days)

    price  = round(random.uniform(*prod["price_range"]), 2)
    qty    = random.choices([1,2,3,4,5], weights=[0.45,0.25,0.15,0.10,0.05])[0]
    disc   = random.choices([0,0.05,0.10,0.15,0.20,0.25,0.30,0.40,0.50],
                             weights=[0.30,0.12,0.15,0.10,0.10,0.08,0.07,0.05,0.03])[0]
    sales  = round(price * qty * (1 - disc), 2)
    margin = random.uniform(*prod["margin"])
    if disc > 0.20:
        margin *= (1 - disc * 0.8)
    profit    = round(sales * margin, 2)
    ship_cost = round(random.uniform(3,45) * (1.0 if ship_mode=="Economy" else
                       1.5 if ship_mode=="Standard" else
                       2.5 if ship_mode=="Express" else 4.0), 2)
    returned  = random.choices([0,1],
                    weights=[0.85 if disc < 0.20 else 0.70,
                             0.15 if disc < 0.20 else 0.30])[0]

    orders.append({
        "Order_ID":       f"ORD-{str(i+1).zfill(6)}",
        "Order_Date":     order_date,
        "Ship_Date":      ship_date,
        "Customer_ID":    cust["Customer_ID"],
        "Product_ID":     prod["Product_ID"],
        "Category":       prod["Category"],
        "Sub_Category":   prod["Sub_Category"],
        "Product_Name":   prod["Product_Name"],
        "Ship_Mode":      ship_mode,
        "Region":         region,
        "State":          state,
        "Sales":          sales,
        "Quantity":       qty,
        "Discount":       disc,
        "Profit":         profit,
        "Shipping_Cost":  ship_cost,
        "Delivery_Time":  ship_days,
        "Returned_Order": returned,
    })

df_orders = pd.DataFrame(orders)

# Introduce realistic messiness
idx_null = df_orders.sample(frac=0.015, random_state=1).index
df_orders.loc[idx_null, "Shipping_Cost"] = np.nan
idx_dup = df_orders.sample(n=50, random_state=2).index
df_orders = pd.concat([df_orders, df_orders.loc[idx_dup]], ignore_index=True)

df_orders.to_csv("data/orders.csv", index=False)
#df_orders.to_csv("/home/claude/Ecommerce_Analytics_Project/data/orders.csv", index=False)
df_customers.to_csv("data/customers.csv", index=False)
#df_customers.to_csv("/home/claude/Ecommerce_Analytics_Project/data/customers.csv", index=False)
print(f"Orders: {len(df_orders)} rows | Customers: {len(df_customers)} rows")
print("Sample order:\n", df_orders.head(2).to_string())
