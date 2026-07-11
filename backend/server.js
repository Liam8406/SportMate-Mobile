require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const User = require("./models/User");
const Session = require("./models/FieldSchedule");

const fieldsRoutes = require("./routes/fields");
const scheduleRoutes = require("./routes/schedule");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_DNS_SERVERS = (process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (process.env.MONGO_URI?.startsWith("mongodb+srv://") && MONGO_DNS_SERVERS.length) {
  dns.setServers(MONGO_DNS_SERVERS);
}

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "לא מחובר",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "לא מחובר",
    });
  }

  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = data.id;
    next();
  } catch {
    res.status(401).json({
      error: "טוקן לא נכון",
    });
  }
}
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, AVATARS_DIR),
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  },
});

app.post("/register", async (req, res) => {
  const { username, email, phone, password, age } = req.body;

  if (!username || !email || !password || !age) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const a = String(age).replace(/\D/g, "");
  if (!a || a < 13 || a > 120) {
    return res.status(400).json({ error: "Invalid age" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      phone,
      age: a,
      password: hashed,
    });

    res.json({ status: "registered" });
  } 
  catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "אימייל כבר קיים" });
    }

    console.error("Register error:", err);
    res.status(500).json({ error: "רישום נכשל" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Email or password incorrect" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Email or password incorrect" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ status: "logged in", token });
});

app.post("/logout", (_, res) => {
  res.clearCookie("token");
  res.json({ status: "logged out" });
});

app.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.userId).select(
    "username email phone age favSport avatar"
  );
  res.json(user);
});

app.post("/profile/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    await User.findByIdAndUpdate(req.userId, {
      avatar: base64Image,
    });

    res.json({ avatar: base64Image });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ error: "Avatar upload failed" });
  }
});

app.put("/profile", auth, async (req, res) => {
  const updates = {};
  const { email, phone, username, age, favSport } = req.body;

  if (email !== undefined) {
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ error: "Email must end with @gmail.com" });
    }
    updates.email = email.toLowerCase();
  }

  if (phone !== undefined) {
    const p = phone.replace(/\D/g, "");
    if (p.length !== 10) {
      return res.status(400).json({ error: "Phone must be 10 digits" });
    }
    updates.phone = p;
  }

  if (username !== undefined) updates.username = username.trim();

  if (age !== undefined) {
    const a = age.replace(/\D/g, "");
    if (a < 13 || a > 120) {
      return res.status(400).json({ error: "Invalid age" });
    }
    updates.age = a;
  }

  if (favSport !== undefined) updates.favSport = favSport;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    await User.findByIdAndUpdate(req.userId, updates);
    res.json({ status: "updated" });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

app.put("/change-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "נא למלא את כל השדות" });
  }

  const user = await User.findById(req.userId);
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return res.status(401).json({ error: "סיסמה נוכחית אינה נכונה" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ status: "סיסמה עודכנה בהצלחה" });
});

app.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username email phone age favSport avatar"
    );

    if (!user) {
      return res.status(404).json({ error: "משתמש לא נמצא" });
    }

    res.json(user);
  } catch {
    res.status(400).json({ error: "מזהה משתמש לא נכון" });
  }
});

app.delete("/profile", auth, async (req, res) => {
  try {
    const userId = req.userId;

    await Session.deleteMany({
      $or: [{ host: userId }, { players: userId }],
    });

    await User.findByIdAndDelete(userId);

    res.clearCookie("token");
    res.json({ success: true });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "מחיקת משתמש נכשלה" });
  }
});

app.get("/geocode", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.status(400).json({ error: "Missing q" });

    const { data } = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q,
          format: "json",
          limit: 1,
          countrycodes: "il",
        },
        headers: { "User-Agent": "SportMate/1.0" },
      }
    );

    if (!data[0]) return res.status(404).json({ error: "Location not found" });

    res.json({
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    });
  } catch {
    res.status(500).json({ error: "Geocode failed" });
  }
});

app.use("/api", fieldsRoutes);
app.use("/schedule", scheduleRoutes);

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB connection failed: missing MONGO_URI");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

startServer();
