// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt'); // For password hashing
const { log } = require('console');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'e50f213cf68274861e5d39c581efa6bd', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.use(express.static('public')); // For serving static files

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB database.');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });


// Define Schemas

//USer Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    usertype: String,
})

const hotelSchema = new mongoose.Schema({
    name: String,
    logo: String,
    address: String,
    qrCode: String
});

const guestSchema = new mongoose.Schema({
    hotelId: mongoose.Schema.Types.ObjectId,
    fullName: String,
    mobileNumber: String,
    address: String,
    purposeOfVisit: String,
    stayDates: { from: Date, to: Date },
    emailId: String,
    idProofNumber: String
});

const User = mongoose.model('User', userSchema);
const Hotel = mongoose.model('Hotel', hotelSchema);
const Guest = mongoose.model('Guest', guestSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});
const upload = multer({ storage: storage });

//guest landing page
app.get('/', async (req, res) => {
    const guestLanding = await Hotel.find();
    res.render('guest-landing', { guestLanding });
});

// Routes for Main Admin
app.get('/admin/hotels', async (req, res) => {
    const hotels = await Hotel.find();
    res.render('hotels', { hotels });
});

app.post('/add-hotel', upload.single('logo'), async (req, res) => {
    const { name, address } = req.body;
    const qrCode = await QRCode.toDataURL(`http://localhost:3000/hotel/${name}`);
    const newHotel = new Hotel({ name, logo: req.file.filename, address, qrCode });
    await newHotel.save();
    res.redirect('/admin/hotels');
});

//const bcrypt = require('bcryptjs');
//const hashedPassword = bcrypt.hashSync("123", 10);
//console.log("Hashed Password:", hashedPassword);

// Route to display guest form
app.get('/hotel/:name', async (req, res) => {
    const hotel = await Hotel.findOne({ name: req.params.name });
    res.render('guest-form', { hotel });
});

// Route to handle guest form submission
app.post('/submit-guest', async (req, res) => {
    const { hotelId, fullName, mobileNumber, address, purposeOfVisit, stayDates, emailId, idProofNumber } = req.body;
    const newGuest = new Guest({ hotelId, fullName, mobileNumber, address, purposeOfVisit, stayDates, emailId, idProofNumber });
    await newGuest.save();
    res.render('thankyou');
});

// Routes for Guest Admin
app.get('/admin/guests/:hotelId', async (req, res) => {
    const guests = await Guest.find({ hotelId: req.params.hotelId });
    res.render('guests', { guests });
});

app.get('/admin/guests', async (req, res) => {
    const adminguest = await Hotel.find();
    res.render('admin-guest', { adminguest });
});

// Route to edit guest details (GET)
app.get('/admin/guests/:hotelId/edit/:guestId', async (req, res) => {
    const guest = await Guest.findById(req.params.guestId);
    if (!guest) {
        return res.status(404).send('Guest not found');
    }
    res.render('edit-guest', { guest });
});

// Route to update guest details (POST)
app.post('/admin/guests/:hotelId/edit/:guestId', async (req, res) => {
    const { fullName, mobileNumber, address, purposeOfVisit, stayDates, emailId, idProofNumber } = req.body;
    await Guest.findByIdAndUpdate(req.params.guestId, {
        fullName,
        mobileNumber,
        address,
        purposeOfVisit,
        stayDates,
        emailId,
        idProofNumber
    });
    res.redirect(`/admin/guests/${req.params.hotelId}`);
});

// Route to view guest details
app.get('/admin/guests/:hotelId/view/:guestId', async (req, res) => {
    const guest = await Guest.findById(req.params.guestId);
    if (!guest) {
        return res.status(404).send('Guest not found');
    }
    res.render('view-guest', { guest });
});

// Login route
app.get('/login', (req, res) => {
    console.log('Login GET route accessed');
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password, usertype } = req.body; // Extract input from the form
    try {
        // Find user with case-insensitive role match
        const user = await User.findOne({
            username: username,
            role: { $regex: new RegExp(`^${usertype}$`, 'i') } // Case-insensitive role matching
        });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id; // Store user ID in session

            // Redirect based on role
            if (usertype.toLowerCase() === 'admin') {
                res.redirect('/admin/hotels');
            } else if (usertype.toLowerCase() === 'guest') {
                res.redirect('/admin/guests');
            } else {
                res.render('login', { error: 'Invalid user type.' });
            }
        } else {
            res.render('login', { error: 'Invalid username, password, or role.' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.render('login', { error: 'An unexpected error occurred. Please try again.' });
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});




