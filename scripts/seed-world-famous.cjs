/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: 'C:/My Things/Github Codes/Assignment/pizzahub-server/.env' });

const VENDOR_ID = "6affcac3794c8b8d284b4307";

const WORLD_FAMOUS_PIZZAS = [
  {
    _id: new ObjectId("6b001111795c562732270001"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "New York Classic Pepperoni & Hot Honey",
    category: "Meat Lovers",
    description: "Iconic NYC hand-tossed thin crust with blistered bubbles, crushed San Marzano tomato sauce, aged whole-milk mozzarella, crispy cupped Ezzo pepperoni cups holding flavorful chili oil, drizzled with wildflower hot honey and Pecorino Romano.",
    price: 22.00,
    location: "Manhattan Brick Hearth",
    images: [
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:00:00Z"),
    updatedAt: new Date("2026-11-20T06:00:00Z")
  },
  {
    _id: new ObjectId("6b001111795c562732270002"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "Chicago Deep Dish Supreme",
    category: "Specialty / Gourmet Pizzas",
    description: "Legendary Windy City deep dish with a golden, flaky cornmeal-infused crust pressed into seasoned cast iron. Layered backwards with Wisconsin mozzarella slices, Italian fennel sausage patties, and thick crushed plum tomato sauce.",
    price: 26.50,
    location: "Windy City Iron Pan",
    images: [
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:01:00Z"),
    updatedAt: new Date("2026-11-20T06:01:00Z")
  },
  {
    _id: new ObjectId("6b001111795c562732270003"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "Detroit-Style Motor City Pepperoni",
    category: "Meat Lovers",
    description: "Authentic Motor City rectangular steel-pan pizza with high-hydration dough. Features a caramelized Wisconsin brick cheese 'frico' crust along crunchy edges, layered under natural-casing pepperoni and finished with ladled racing stripes of red sauce.",
    price: 24.00,
    location: "Detroit Steel Hearth",
    images: [
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:02:00Z"),
    updatedAt: new Date("2026-11-20T06:02:00Z")
  },
  {
    _id: new ObjectId("6b001111795c562732270004"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "Sicilian Sfincione Tradizionale",
    category: "Classic Pizzas",
    description: "Ancient Sicilian bakery sheet pizza with an airy, pillowy focaccia-like crumb. Topped with sweet caramelized Tropea onions, slow-simmered tomato sugo, wild mountain oregano, Sicilian caciocavallo cheese, and toasted golden olive oil breadcrumbs.",
    price: 20.50,
    location: "Palermo Bakery Hearth",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:03:00Z"),
    updatedAt: new Date("2026-11-20T06:03:00Z")
  },
  {
    _id: new ObjectId("6b001111795c562732270005"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "Pizza Capricciosa Romana",
    category: "Meat Lovers",
    description: "Classic Roman thin-crust masterpiece topped with rich tomato sauce, fresh fior di latte mozzarella, Italian prosciutto cotto, marinated artichoke hearts (carciofi), sliced cremini mushrooms, and Kalamata black olives.",
    price: 23.00,
    location: "Rome Trastevere Hearth",
    images: [
      "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:04:00Z"),
    updatedAt: new Date("2026-11-20T06:04:00Z")
  },
  {
    _id: new ObjectId("6b001111795c562732270006"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "Pizza Marinara Tradizionale (Antica Napoli)",
    category: "Vegetarian Pizzas",
    description: "The historic, oldest recorded pizza of Naples dating back to 1734. Simple perfection featuring organic San Marzano D.O.P. tomatoes, razor-thin sliced garlic, mountain oregano from Campania, and cold-pressed Sorrento olive oil.",
    price: 16.50,
    location: "Naples Spaccanapoli Oven",
    images: [
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:05:00Z"),
    updatedAt: new Date("2026-11-20T06:05:00Z")
  },
  {
    _id: new ObjectId("6b001111795c562732270007"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "Pizza Prosciutto di Parma e Rucola",
    category: "Specialty / Gourmet Pizzas",
    description: "Artisanal pie baked with fior di latte and cherry tomatoes, then draped post-bake with silky 24-month aged Prosciutto di Parma, peppery wild baby arugula, shaved 24-month Parmigiano-Reggiano, and aged Modena balsamic drizzle.",
    price: 25.50,
    location: "Emilia-Romagna Hearth",
    images: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:06:00Z"),
    updatedAt: new Date("2026-11-20T06:06:00Z")
  },
  {
    _id: new ObjectId("6b001111795c562732270008"),
    vendorId: new ObjectId(VENDOR_ID),
    itemName: "California BBQ Chicken & Smoked Gouda",
    category: "Meat Lovers",
    description: "The 1980s Californian icon. Hearth-baked sourdough brushed with tangy Kansas City BBQ sauce, smoked gouda, tender flame-grilled chicken breast, thinly sliced sweet red onion, and fresh chopped cilantro.",
    price: 21.50,
    location: "West Coast Brick Hearth",
    images: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop"
    ],
    status: "approved",
    createdAt: new Date("2026-11-20T06:07:00Z"),
    updatedAt: new Date("2026-11-20T06:07:00Z")
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI not set");
  }

  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB Atlas!");

  const db = client.db('pizzahub');
  const collection = db.collection('menuItems');

  for (const pizza of WORLD_FAMOUS_PIZZAS) {
    await collection.updateOne(
      { _id: pizza._id },
      { $set: pizza },
      { upsert: true }
    );
    console.log(`✓ Seeded: ${pizza.itemName} (${pizza.category} - $${pizza.price})`);
  }

  const total = await collection.countDocuments({ status: "approved" });
  console.log(`\n🎉 Total approved menu items now in database: ${total}`);

  await client.close();
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
