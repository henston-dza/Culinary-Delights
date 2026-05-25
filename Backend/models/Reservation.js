const mongoose = require('mongoose');

const CulinaryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    spicy: {
        type: Boolean,
        default: false
    },
    veg: {
        type: Boolean,
        default: false
    },
    gluten: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const ReservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reservation must be linked to a registered user']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    guests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'Must have at least 1 guest'],
        max: [20, 'Max limit of guests per table reservation is 20']
    },
    date: {
        type: String, // String avoids UTC timezone shift problems (e.g. YYYY-MM-DD)
        required: [true, 'Reservation date is required']
    },
    time: {
        type: String, // HH:MM
        required: [true, 'Reservation time is required']
    },
    special: {
        type: String,
        trim: true
    },
    culinaryPlan: [CulinaryItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
