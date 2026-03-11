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
    ['Idli','https://source.unsplash.com/600x400/?idli'],
    ['Dosa','https://source.unsplash.com/600x400/?dosa'],
    ['Masala Dosa','https://source.unsplash.com/600x400/?masala-dosa'],
    ['Plain Dosa','https://source.unsplash.com/600x400/?plain-dosa'],
    ['Ghee Roast','https://source.unsplash.com/600x400/?ghee-roast-dosa'],
    ['Rava Dosa','https://source.unsplash.com/600x400/?rava-dosa'],
    ['Podi Dosa','https://source.unsplash.com/600x400/?podi-dosa'],
    ['Onion Dosa','https://source.unsplash.com/600x400/?onion-dosa'],
    ['Uttapam','https://source.unsplash.com/600x400/?uttapam'],
    ['Tomato Uttapam','https://source.unsplash.com/600x400/?uttapam'],
    ['Pongal','https://source.unsplash.com/600x400/?pongal'],
    ['Ven Pongal','https://source.unsplash.com/600x400/?ven-pongal'],
    ['Medu Vada','https://source.unsplash.com/600x400/?vada'],
    ['Sambar Vada','https://source.unsplash.com/600x400/?sambar-vada'],
    ['Rasam','https://source.unsplash.com/600x400/?rasam'],
    ['Sambar','https://source.unsplash.com/600x400/?sambar'],
    ['Curd Rice','https://source.unsplash.com/600x400/?curd-rice'],
    ['Lemon Rice','https://source.unsplash.com/600x400/?lemon-rice'],
    ['Tamarind Rice','https://source.unsplash.com/600x400/?tamarind-rice'],
    ['Tomato Rice','https://source.unsplash.com/600x400/?tomato-rice'],
    ['Vegetable Biryani','https://source.unsplash.com/600x400/?veg-biryani'],
    ['Chicken Biryani','https://source.unsplash.com/600x400/?chicken-biryani'],
    ['Mutton Biryani','https://source.unsplash.com/600x400/?mutton-biryani'],
    ['Egg Biryani','https://source.unsplash.com/600x400/?egg-biryani'],
    ['Parotta','https://source.unsplash.com/600x400/?parotta'],
    ['Kothu Parotta','https://source.unsplash.com/600x400/?kothu-parotta'],
    ['Chicken Kothu','https://source.unsplash.com/600x400/?kothu-parotta'],
    ['Egg Parotta','https://source.unsplash.com/600x400/?egg-parotta'],
    ['Chapati','https://source.unsplash.com/600x400/?chapati'],
    ['Poori','https://source.unsplash.com/600x400/?poori'],
    ['Aappam','https://source.unsplash.com/600x400/?appam'],
    ['Idiyappam','https://source.unsplash.com/600x400/?idiyappam'],
    ['Puttu','https://source.unsplash.com/600x400/?puttu'],
    ['Upma','https://source.unsplash.com/600x400/?upma'],
    ['Kesari','https://source.unsplash.com/600x400/?kesari'],
    ['Payasam','https://source.unsplash.com/600x400/?payasam'],
    ['Sweet Pongal','https://source.unsplash.com/600x400/?sweet-pongal'],
    ['Mysore Pak','https://source.unsplash.com/600x400/?mysore-pak'],
    ['Murukku','https://source.unsplash.com/600x400/?murukku'],
    ['Adhirasam','https://source.unsplash.com/600x400/?adhirasam'],
    ['Banana Chips','https://source.unsplash.com/600x400/?banana-chips'],
    ['Fish Curry','https://source.unsplash.com/600x400/?fish-curry'],
    ['Fish Fry','https://source.unsplash.com/600x400/?fish-fry'],
    ['Chicken Curry','https://source.unsplash.com/600x400/?chicken-curry'],
    ['Mutton Curry','https://source.unsplash.com/600x400/?mutton-curry'],
    ['Paneer Butter Masala','https://source.unsplash.com/600x400/?paneer'],
    ['Veg Kurma','https://source.unsplash.com/600x400/?veg-kurma'],
    ['Avial','https://source.unsplash.com/600x400/?avial'],
    ['Poriyal','https://source.unsplash.com/600x400/?poriyal'],
    ['Tamil Nadu Meals','https://source.unsplash.com/600x400/?south-indian-meals']
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
