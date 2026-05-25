const Reservation = require('../../models/Reservation');

// @desc    Create a new table reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
    const { name, email, phone, guests, date, time, special, culinaryPlan } = req.body;

    // Validation
    if (!name || !email || !phone || !guests || !date || !time) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const newReservation = new Reservation({
            user: req.user.id,
            name,
            email,
            phone,
            guests: parseInt(guests),
            date,
            time,
            special,
            culinaryPlan: culinaryPlan || [] // Structured culinary plan array
        });

        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (err) {
        console.error('Reservation creation error:', err);
        res.status(500).json({ message: 'Server error booking reservation. Please try again.' });
    }
};

// @desc    Get user's reservation history
// @route   GET /api/reservations/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Reservation.find({ user: req.user.id })
            .sort({ createdAt: -1 }); // Newest reservations first
        
        res.json(bookings);
    } catch (err) {
        console.error('Fetch reservations error:', err);
        res.status(500).json({ message: 'Server error retrieving reservation history.' });
    }
};
