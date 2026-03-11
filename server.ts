import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("restaurant.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    phone TEXT,
    map_url TEXT,
    rating REAL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_url TEXT,
    price INTEGER DEFAULT 100
  );
`);

// Seed data
const restaurantCount = db.prepare("SELECT COUNT(*) as count FROM restaurants").get() as { count: number };
if (restaurantCount.count === 0) {
  const insertRestaurant = db.prepare("INSERT INTO restaurants (name, location, phone, map_url, rating, description) VALUES (?, ?, ?, ?, ?, ?)");
  
  const restaurants = [
    ["Vadamalai Restaurant", "Krishnagiri Road, near Meenakshi Theatre", "098941 48006", "https://maps.google.com/?q=Vadamalai+Restaurant+Tirupattur", 4.5, "Vegetarian restaurant located near a bus stop on Krishnagiri Road"],
    ["Chettinadu Mess", "1st Cross Street, Sakthi Nagar", "", "https://maps.google.com/?q=Chettinadu+Mess+Tirupattur", 4.7, "Serves Chettinad-style food, close to Tirupattur railway station"],
    ["Chettiyar Mess", "Tirupattur–Pudupettai Road", "", "https://maps.google.com/?q=Chettiyar+Mess+Tirupattur", 4.5, "Popular for affordable South Indian meals and tiffin"],
    ["Zwarma Restaurant Shawarma Makers", "Gandhi Road", "", "https://maps.google.com/?q=Zwarma+Restaurant+Tirupattur", 4.0, "Known for shawarma and fast food"],
    ["Tasty Pizza Corner", "Vaniyambadi Road, Elil Nagar", "095003 66422", "https://maps.google.com/?q=Tasty+Pizza+Corner+Tirupattur", 4.2, "Pizza shop offering takeaway and delivery"],
    ["Hotel Ajai Adhavan Pure Veg", "Kodiyur, near Jolarpet Bus Stop", "", "https://maps.google.com/?q=Hotel+Ajai+Adhavan+Pure+Veg+Tirupattur", 4.7, "Vegetarian restaurant open 24 hours"]
  ];

  for (const r of restaurants) {
    insertRestaurant.run(...r);
  }
}

const foodCount = db.prepare("SELECT COUNT(*) as count FROM foods").get() as { count: number };
if (foodCount.count === 0) {
  const insertFood = db.prepare("INSERT INTO foods (name, image_url) VALUES (?, ?)");
  const foods = [
    ['Idli','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Dosa','https://images.unsplash.com/photo-1541014741259-df549fa9ba67?w=600&h=400&fit=crop'],
    ['Masala Dosa','https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop'],
    ['Plain Dosa','https://images.unsplash.com/photo-1541014741259-df549fa9ba67?w=600&h=400&fit=crop'],
    ['Ghee Roast','https://images.unsplash.com/photo-1541014741259-df549fa9ba67?w=600&h=400&fit=crop'],
    ['Rava Dosa','https://images.unsplash.com/photo-1541014741259-df549fa9ba67?w=600&h=400&fit=crop'],
    ['Podi Dosa','https://images.unsplash.com/photo-1541014741259-df549fa9ba67?w=600&h=400&fit=crop'],
    ['Onion Dosa','https://images.unsplash.com/photo-1541014741259-df549fa9ba67?w=600&h=400&fit=crop'],
    ['Uttapam','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Tomato Uttapam','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Pongal','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Ven Pongal','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Medu Vada','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Sambar Vada','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Rasam','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Sambar','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Curd Rice','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Lemon Rice','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Tamarind Rice','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Tomato Rice','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Vegetable Biryani','https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&h=400&fit=crop'],
    ['Chicken Biryani','https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&h=400&fit=crop'],
    ['Mutton Biryani','https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&h=400&fit=crop'],
    ['Egg Biryani','https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&h=400&fit=crop'],
    ['Parotta','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Kothu Parotta','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Chicken Kothu','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Egg Parotta','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Chapati','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Poori','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Aappam','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Idiyappam','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Puttu','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Upma','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Kesari','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Payasam','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Sweet Pongal','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Mysore Pak','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Murukku','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Adhirasam','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Banana Chips','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Fish Curry','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Fish Fry','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Chicken Curry','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Mutton Curry','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Paneer Butter Masala','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Veg Kurma','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Avial','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Poriyal','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'],
    ['Tamil Nadu Meals','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop']
  ];

  for (const f of foods) {
    insertFood.run(...f);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/restaurants", (req, res) => {
    const restaurants = db.prepare("SELECT * FROM restaurants").all();
    res.json(restaurants);
  });

  app.get("/api/foods", (req, res) => {
    const foods = db.prepare("SELECT * FROM foods").all();
    res.json(foods);
  });

  app.post("/api/bookings", (req, res) => {
    // Simple mock booking
    const { restaurantId, date, time, guests, name } = req.body;
    console.log(`Booking received: ${name} at ${restaurantId} on ${date} ${time} for ${guests} guests`);
    res.json({ success: true, message: "Booking confirmed!" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
