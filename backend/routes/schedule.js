const express = require("express");
const router = express.Router();
const Session = require("../models/FieldSchedule");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

router.get("/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;

    const sessions = await Session.find({ fieldId })
      .populate("host", "username age avatar")
      .populate("players", "username age avatar")
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to load sessions" });
  }
});

router.post("/create", auth, async (req, res) => {
  try {
    const { fieldId, fieldName, sport, date, startTime, duration } = req.body;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const now = new Date();
    const maxFuture = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (duration < 15 || duration > 90) {
      return res.status(400).json({
        error: "Game duration must be between 15 and 90 minutes"
      });
    }

    if (startDateTime < new Date(now.getTime() - 5 * 60000)) {
      return res.status(400).json({
        error: "Cannot schedule a game in the past"
      });
    }

    if (startDateTime > maxFuture) {
      return res.status(400).json({
        error: "You can only schedule a game up to 24 hours in advance"
      });
    }

    const existingHostSession = await Session.findOne({
      host: req.userId,
      endTime: { $gt: now }
    });

    if (existingHostSession) {
      return res.status(400).json({
        error: "You already have an active game and cannot create another one"
      });
    }

    const overlappingSession = await Session.findOne({
      fieldId,
      startTimeDate: { $lt: endDateTime },
      endTime: { $gt: startDateTime }
    });

    if (overlappingSession) {
      return res.status(400).json({
        error: "The field is already booked during this time"
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
      error: "Failed to create game"
    });
  }
});

router.post("/:sessionId/join", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) return res.status(404).json({ error: "Session not found" });

    if (session.players.includes(req.userId)) {
      return res.status(400).json({ error: "Already joined" });
    }

    if (session.players.length >= session.maxPlayers) {
      return res.status(400).json({ error: "Session is full" });
    }

    session.players.push(req.userId);
    session.currentPlayers += 1;
    await session.save();

    const populated = await session.populate("players host", "username age avatar");
    res.json(populated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to join" });
  }
});

router.delete("/:sessionId", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.host.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: "Only the creator can delete this session" });
    }

    await Session.findByIdAndDelete(sessionId);

    res.json({ 
      success: true, 
      message: "Session deleted successfully" 
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
});

module.exports = router;