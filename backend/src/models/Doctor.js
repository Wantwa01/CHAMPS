import mongoose from 'mongoose';

const WorkingHoursSchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6 // 0 = Sunday, 1 = Monday, etc.
    },
    startTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    endTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    isWorking: {
        type: Boolean,
        default: true
    }
}, { _id: false });

const AvailableSlotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }
}, { _id: false });

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    workingHours: [WorkingHoursSchema],
    availableSlots: [AvailableSlotSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    qualifications: {
        type: String,
        trim: true
    },
    experience: {
        type: Number,
        min: 0
    }
}, { timestamps: true });

// Index for efficient slot queries
DoctorSchema.index({ 'availableSlots.date': 1, 'availableSlots.timeSlot': 1 });
DoctorSchema.index({ 'availableSlots.isBooked': 1 });

// Method to get available slots for a specific date
DoctorSchema.methods.getAvailableSlotsForDate = function(date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return this.availableSlots.filter(slot => {
        const slotDate = new Date(slot.date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === targetDate.getTime() && !slot.isBooked;
    });
};

// Method to book a slot
DoctorSchema.methods.bookSlot = function(date, timeSlot, appointmentId) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const slot = this.availableSlots.find(s => {
        const slotDate = new Date(s.date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === targetDate.getTime() &&
            s.timeSlot === timeSlot &&
            !s.isBooked;
    });

    if (slot) {
        slot.isBooked = true;
        slot.appointmentId = appointmentId;
        return true;
    }
    return false;
};

// Method to release a slot
DoctorSchema.methods.releaseSlot = function(appointmentId) {
    const slot = this.availableSlots.find(s => s.appointmentId && s.appointmentId.equals(appointmentId));
    if (slot) {
        slot.isBooked = false;
        slot.appointmentId = undefined;
        return true;
    }
    return false;
};

// Static method to generate slots for a date range
DoctorSchema.statics.generateSlotsForDateRange = async function(doctorId, startDate, endDate, slotDuration = 30) {
    const doctor = await this.findById(doctorId);
    if (!doctor) return false;

    const slots = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const workingHours = doctor.workingHours.find(wh => wh.dayOfWeek === dayOfWeek && wh.isWorking);

        if (workingHours) {
            const startTime = new Date(`2000-01-01T${workingHours.startTime}:00`);
            const endTime = new Date(`2000-01-01T${workingHours.endTime}:00`);

            let currentTime = new Date(startTime);
            while (currentTime < endTime) {
                const timeSlot = currentTime.toTimeString().slice(0, 5);

                // Check if slot already exists
                const existingSlot = doctor.availableSlots.find(s => {
                    const slotDate = new Date(s.date);
                    slotDate.setHours(0, 0, 0, 0);
                    const currentSlotDate = new Date(currentDate);
                    currentSlotDate.setHours(0, 0, 0, 0);
                    return slotDate.getTime() === currentSlotDate.getTime() && s.timeSlot === timeSlot;
                });

                if (!existingSlot) {
                    slots.push({
                        date: new Date(currentDate),
                        timeSlot,
                        isBooked: false
                    });
                }

                currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
            }
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (slots.length > 0) {
        doctor.availableSlots.push(...slots);
        await doctor.save();
    }

    return slots.length;
};

export default mongoose.model('Doctor', DoctorSchema);