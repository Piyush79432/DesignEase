const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public")) // Serve static files

// MongoDB Connection
const MONGO_URI = "mongodb+srv://YOUR_ID:YOUR_PASS@cluster0.ompj4ar.mongodb.net/designease?appName=Cluster0"

// FIX: Removed deprecated options object
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas (Cloud)"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err))

// User Schema with timestamps
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model("User", UserSchema)
// Chat Group / Room Schema
const roomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true }, // The Access Code
    name: { type: String, required: true },
    type: { type: String, enum: ['group', 'direct'], default: 'group' },
    members: [String], // Array of Emails
    createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Room = mongoose.model('Room', roomSchema);
const Message = mongoose.model('Message', messageSchema);

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true }, // Email of owner
    acl: [String], // Array of emails allowed to view
    createdAt: { type: Date, default: Date.now }
});

// Access Code Schema (One-time use logic)
const accessCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24h (optional)
});

const Folder = mongoose.model('Folder', folderSchema);
const AccessCode = mongoose.model('AccessCode', accessCodeSchema);
// API Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})
// --- 2. MONGOOSE SCHEMAS ---

// Folder Schema (Stores Directory info & Access Control List)


// --- 3. API ENDPOINTS ---

// GET: Fetch folders for a user (Owns it OR is in ACL)
app.post('/api/chat/room', async (req, res) => {
    const { roomId, name, userEmail } = req.body;
    try {
        let room = await Room.findOne({ roomId });
        
        if (!room) {
            // Create new room
            room = new Room({ roomId, name, members: [userEmail] });
        } else {
            // Join existing
            if (!room.members.includes(userEmail)) {
                room.members.push(userEmail);
            }
        }
        await room.save();
        res.json({ success: true, room });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Messages for a Room
app.get('/api/chat/messages/:roomId', async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/folders', async (req, res) => {
    const { email } = req.query;
    try {
        const folders = await Folder.find({
            $or: [{ owner: email }, { acl: email }]
        }).sort({ createdAt: -1 });
        res.json(folders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new folder
app.post('/api/folders', async (req, res) => {
    const { name, owner } = req.body;
    try {
        const newFolder = new Folder({ name, owner, acl: [] });
        await newFolder.save();
        res.json(newFolder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Generate One-Time Code
app.post('/api/generate-code', async (req, res) => {
    const { folderId } = req.body;
    try {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newCode = new AccessCode({ code, folderId });
        await newCode.save();
        res.json({ code: newCode.code });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Redeem Code (Grant Access)
app.post('/api/redeem-code', async (req, res) => {
    const { code, email } = req.body;
    try {
        // 1. Find Code and check if used
        const codeRecord = await AccessCode.findOne({ code });
        if (!codeRecord) return res.status(404).json({ success: false, msg: 'Invalid code.' });
        if (codeRecord.isUsed) return res.status(400).json({ success: false, msg: 'Code already used/expired.' });

        // 2. Find Folder
        const folder = await Folder.findById(codeRecord.folderId);
        if (!folder) return res.status(404).json({ success: false, msg: 'Folder not found.' });

        // 3. Check if user already has access
        if (folder.owner === email || folder.acl.includes(email)) {
            return res.status(400).json({ success: false, msg: 'You already have access.' });
        }

        // 4. Update Folder ACL & Mark Code Used
        folder.acl.push(email);
        await folder.save();
        
        codeRecord.isUsed = true;
        await codeRecord.save();

        res.json({ success: true, msg: 'Access granted!', folderName: folder.name });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
});

// POST: Revoke Access
app.post('/api/revoke-access', async (req, res) => {
    const { folderId, emailToRemove } = req.body;
    try {
        await Folder.findByIdAndUpdate(folderId, {
            $pull: { acl: emailToRemove }
        });
        res.json({ success: true, msg: 'Access revoked.' });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
});

// GET: Get Access List (ACL) for a specific folder
app.get('/api/folders/:id/access', async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) return res.status(404).json({ error: 'Not found' });
        res.json({ owner: folder.owner, acl: folder.acl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login instead.",
      })
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Note: In production, hash the password using bcrypt
    })

    await newUser.save()

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: name,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    })
  }
})

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Find user
    const user = await User.findOne({ email, password })

    if (user) {
      // Update last login
      user.lastLogin = new Date()
      await user.save()

      res.json({
        success: true,
        message: "Login successful",
        user: user.name,
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    })
  }
})

// Get all users (for admin/testing purposes)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password") // Exclude passwords
    res.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// Delete user endpoint (for testing)
app.delete("/api/users/:email", async (req, res) => {
  try {
    const { email } = req.params
    const result = await User.deleteOne({ email })

    if (result.deletedCount > 0) {
      res.json({
        success: true,
        message: "User deleted successfully",
      })
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
  } catch (error) {
    console.error("Delete error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 API available at http://localhost:${PORT}`)
})