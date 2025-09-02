import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true
    },
    symptoms: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'emergency'],
        default: 'normal'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'waived'],
        default: 'pending'
    },
    source: {
        type: String,
        enum: ['web', 'mobile', 'phone', 'walk-in'],
        default: 'web'
    },
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    cancellationReason: {
        type: String,
        trim: true
    },
    rescheduledFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
AppointmentSchema.index({ patientId: 1, date: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ date: 1 });

// Compound unique index to prevent double booking
AppointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });

// Pre-save middleware to validate appointment
AppointmentSchema.pre('save', async function(next) {
    // Check if this is a new appointment or if date/time has changed
    if (this.isNew || this.isModified('date') || this.isModified('timeSlot') || this.isModified('doctorId')) {
        // Check for double booking
        const existingAppointment = await this.constructor.findOne({
            doctorId: this.doctorId,
            date: this.date,
            timeSlot: this.timeSlot,
            status: { $nin: ['cancelled', 'completed'] },
            _id: { $ne: this._id }
        });

        if (existingAppointment) {
            const error = new Error('This time slot is already booked');
            error.name = 'ValidationError';
            return next(error);
        }

        // Check if patient already has an appointment with this doctor on the same date
        const patientAppointment = await this.constructor.findOne({
            patientId: this.patientId,
            doctorId: this.doctorId,
            date: this.date,
            status: { $nin: ['cancelled', 'completed'] },
            _id: { $ne: this._id }
        });

        if (patientAppointment) {
            const error = new Error('You already have an appointment with this doctor on this date');
            error.name = 'ValidationError';
            return next(error);
        }
    }

    next();
});

// Method to check if appointment can be cancelled
AppointmentSchema.methods.canBeCancelled = function() {
    const now = new Date();
    const appointmentDate = new Date(this.date);
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    // Can cancel if more than 24 hours before appointment
    return hoursDiff > 24 && this.status === 'pending';
};

// Method to check if appointment can be rescheduled
AppointmentSchema.methods.canBeRescheduled = function() {
    const now = new Date();
    const appointmentDate = new Date(this.date);
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    // Can reschedule if more than 12 hours before appointment
    return hoursDiff > 12 && this.status === 'pending';
};

// Static method to get appointments for a patient
AppointmentSchema.statics.getPatientAppointments = function(patientId, status = null) {
    const query = { patientId };
    if (status) {
        query.status = status;
    }

    return this.find(query)
        .populate('doctorId', 'name specialization')
        .sort({ date: 1, timeSlot: 1 });
};

// Static method to get appointments for a doctor
AppointmentSchema.statics.getDoctorAppointments = function(doctorId, date = null, status = null) {
    const query = { doctorId };
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (status) {
        query.status = status;
    }

    return this.find(query)
        .populate('patientId', 'username phone')
        .sort({ date: 1, timeSlot: 1 });
};

export default mongoose.model('Appointment', AppointmentSchema);