const express = require("express");
const router = express.Router();
const Session = require("../models/FieldSchedule");
const jwt = require("jsonwebtoken");

function formatLocalDate(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const token = bearerToken || req.cookies?.token;

  if (!token) return res.status(401).json({ error: "יש להתחבר כדי להמשיך" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id;
    next();
  } catch {
    res.status(401).json({ error: "פג תוקף ההתחברות" });
  }
}

router.get("/:fieldId", auth, async (req, res) => {
  try {
    const { fieldId } = req.params;

    const sessions = await Session.find({
      $or: [
        { fieldId },
        { host: req.userId, endTime: { $gt: new Date() } }
      ]
    })
      .populate("host", "username age avatar")
      .populate("players", "username age avatar")
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "טעינת המשחקים נכשלה" });
  }
});

router.post("/create", auth, async (req, res) => {
  try {
    const { fieldId, fieldName, sport, date, startTime, duration } = req.body;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const todayKey = formatLocalDate(now);
    const tomorrowKey = formatLocalDate(tomorrow);

    if (!fieldId || Number.isNaN(startDateTime.getTime())) {
      return res.status(400).json({ error: "פרטי המשחק אינם תקינים" });
    }

    if (duration < 15 || duration > 90) {
      return res.status(400).json({
        error: "משך המשחק חייב להיות בין 15 ל-90 דקות"
      });
    }

    if (date !== todayKey && date !== tomorrowKey) {
      return res.status(400).json({
        error: "ניתן לקבוע משחק רק להיום או למחר"
      });
    }

    if (date === todayKey && startDateTime < new Date(now.getTime() - 5 * 60000)) {
      return res.status(400).json({
        error: "לא ניתן לקבוע משחק בעבר"
      });
    }

    const existingHostSession = await Session.findOne({
      host: req.userId,
      endTime: { $gt: now }
    });

    if (existingHostSession) {
      return res.status(400).json({
        error: "כבר יצרת משחק פעיל ולא ניתן ליצור משחק נוסף"
      });
    }

    const overlappingSession = await Session.findOne({
      fieldId,
      startTimeDate: { $lt: endDateTime },
      endTime: { $gt: startDateTime }
    });

    if (overlappingSession) {
      return res.status(400).json({
        error: "המגרש כבר תפוס בשעות שנבחרו"
      });
    }

    const newSession = await Session.create({
      fieldId,
      fieldName,
      sport,
      host: req.userId,
      date,
      startTime,
      startTimeDate: startDateTime,
      durationMinutes: duration,
      endTime: endDateTime,
      players: [req.userId],
      currentPlayers: 1
    });

    const populated = await newSession.populate(
      "players host",
      "username age avatar"
    );

    res.json(populated);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "יצירת המשחק נכשלה"
    });
  }
});

router.post("/:sessionId/join", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) return res.status(404).json({ error: "המשחק לא נמצא" });

    if (session.players.some((playerId) => playerId.toString() === req.userId.toString())) {
      return res.status(400).json({ error: "כבר הצטרפת למשחק" });
    }

    if (session.players.length >= session.maxPlayers) {
      return res.status(400).json({ error: "המשחק מלא" });
    }

    session.players.push(req.userId);
    session.currentPlayers += 1;
    await session.save();

    const populated = await session.populate("players host", "username age avatar");
    res.json(populated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ההצטרפות למשחק נכשלה" });
  }
});

router.delete("/:sessionId", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "המשחק לא נמצא" });
    }

    if (session.host.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: "רק יוצר המשחק יכול למחוק אותו" });
    }

    await Session.findByIdAndDelete(sessionId);

    res.json({ 
      success: true, 
      message: "המשחק נמחק בהצלחה"
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "מחיקת המשחק נכשלה" });
  }
});

module.exports = router;
