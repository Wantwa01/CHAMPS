import Joi from 'joi';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

// Validation schemas
const createAppointmentSchema = Joi.object({
    doctorId: Joi.string().required(),
    date: Joi.date().min('now').required(),
    timeSlot: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    notes: Joi.string().optional().allow(''),
    symptoms: Joi.string().optional().allow(''),
    priority: Joi.string().valid('normal', 'urgent', 'emergency').default('normal')
});

const updateAppointmentSchema = Joi.object({
    date: Joi.date().min('now').optional(),
    timeSlot: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    notes: Joi.string().optional().allow(''),
    symptoms: Joi.string().optional().allow(''),
    priority: Joi.string().valid('normal', 'urgent', 'emergency').optional()
});

const cancelAppointmentSchema = Joi.object({
    cancellationReason: Joi.string().required().min(3)
});

// Helper function to format appointment response
const formatAppointmentResponse = (appointment) => ({
    id: appointment._id,
    doctor: {
        id: appointment.doctorId._id,
        name: appointment.doctorId.name,
        specialization: appointment.doctorId.specialization
    },
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    status: appointment.status,
    notes: appointment.notes,
    symptoms: appointment.symptoms,
    priority: appointment.priority,
    paymentStatus: appointment.paymentStatus,
    source: appointment.source,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt
});

// Get available slots for a doctor on a specific date
export const getDoctorSlots = async(req, res) => {
    try {
        const { id: doctorId } = req.params;
        const { date } = req.query;

        // Validate date parameter
        if (!date) {
            return res.status(400).json({
                message: 'Date parameter is required',
                details: ['Please provide a date in YYYY-MM-DD format']
            });
        }

        // Validate date format
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format',
                details: ['Date must be in YYYY-MM-DD format']
            });
        }

        // Check if date is in the past
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (targetDate < now) {
            return res.status(400).json({
                message: 'Cannot view slots for past dates',
                details: ['Please select a future date']
            });
        }

        // Find the doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (!doctor.isActive) {
            return res.status(400).json({ message: 'Doctor is not available' });
        }

        // Get available slots for the specified date
        const availableSlots = doctor.getAvailableSlotsForDate(targetDate);

        // If no slots exist for this date, generate them based on working hours
        if (availableSlots.length === 0) {
            const slotsGenerated = await Doctor.generateSlotsForDateRange(
                doctorId,
                targetDate,
                targetDate,
                30 // 30-minute slots
            );

            if (slotsGenerated > 0) {
                // Refresh doctor data and get slots again
                await doctor.refresh();
                const refreshedDoctor = await Doctor.findById(doctorId);
                const newAvailableSlots = refreshedDoctor.getAvailableSlotsForDate(targetDate);
                return res.json({
                    message: 'Available slots retrieved successfully',
                    data: {
                        doctor: {
                            id: doctor._id,
                            name: doctor.name,
                            specialization: doctor.specialization
                        },
                        date: targetDate.toISOString().split('T')[0],
                        availableSlots: newAvailableSlots.map(slot => ({
                            timeSlot: slot.timeSlot,
                            isBooked: slot.isBooked
                        }))
                    }
                });
            }
        }

        return res.json({
            message: 'Available slots retrieved successfully',
            data: {
                doctor: {
                    id: doctor._id,
                    name: doctor.name,
                    specialization: doctor.specialization
                },
                date: targetDate.toISOString().split('T')[0],
                availableSlots: availableSlots.map(slot => ({
                    timeSlot: slot.timeSlot,
                    isBooked: slot.isBooked
                }))
            }
        });

    } catch (error) {
        console.error('Error getting doctor slots:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new appointment
export const createAppointment = async(req, res) => {
    try {
        // Validate request body
        const { error, value } = createAppointmentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                details: error.details.map(d => d.message)
            });
        }

        const { doctorId, date, timeSlot, notes, symptoms, priority } = value;
        const patientId = req.user.id;

        // Check if patient exists and is active
        const patient = await Patient.findById(patientId);
        if (!patient || !patient.isActive) {
            return res.status(400).json({ message: 'Patient account not found or inactive' });
        }

        // Check if doctor exists and is active
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.isActive) {
            return res.status(400).json({ message: 'Doctor not found or inactive' });
        }

        // Check if the slot is available
        const targetDate = new Date(date);
        const availableSlots = doctor.getAvailableSlotsForDate(targetDate);
        const requestedSlot = availableSlots.find(slot => slot.timeSlot === timeSlot);

        if (!requestedSlot) {
            return res.status(400).json({
                message: 'Selected time slot is not available',
                details: ['Please choose from the available slots']
            });
        }

        // Check if patient already has an appointment with this doctor on the same date
        const existingAppointment = await Appointment.findOne({
            patientId,
            doctorId,
            date: targetDate,
            status: { $nin: ['cancelled', 'completed'] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: 'You already have an appointment with this doctor on this date',
                details: ['Please choose a different date or doctor']
            });
        }

        // Create the appointment
        const appointment = new Appointment({
            patientId,
            doctorId,
            date: targetDate,
            timeSlot,
            notes: notes || '',
            symptoms: symptoms || '',
            priority,
            source: 'web'
        });

        await appointment.save();

        // Book the slot in the doctor's schedule
        const slotBooked = doctor.bookSlot(targetDate, timeSlot, appointment._id);
        if (!slotBooked) {
            // If slot booking fails, delete the appointment
            await Appointment.findByIdAndDelete(appointment._id);
            return res.status(400).json({ message: 'Failed to book the selected time slot' });
        }

        await doctor.save();

        // Populate doctor details for response
        await appointment.populate('doctorId', 'name specialization');

        return res.status(201).json({
            message: 'Appointment booked successfully',
            data: formatAppointmentResponse(appointment)
        });

    } catch (error) {
        console.error('Error creating appointment:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                details: [error.message]
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'This time slot is already booked',
                details: ['Please choose a different time slot']
            });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all appointments for the logged-in patient
export const getPatientAppointments = async(req, res) => {
    try {
        const patientId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        // Validate status if provided
        if (status && !['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status parameter',
                details: ['Status must be one of: pending, confirmed, rescheduled, cancelled, completed']
            });
        }

        // Build query
        const query = { patientId };
        if (status) {
            query.status = status;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const appointments = await Appointment.find(query)
            .populate('doctorId', 'name specialization')
            .sort({ date: 1, timeSlot: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Appointment.countDocuments(query);

        const formattedAppointments = appointments.map(formatAppointmentResponse);

        return res.json({
            message: 'Appointments retrieved successfully',
            data: {
                appointments: formattedAppointments,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error getting patient appointments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific appointment by ID
export const getAppointmentById = async(req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;

        const appointment = await Appointment.findById(id)
            .populate('doctorId', 'name specialization phone email')
            .populate('patientId', 'username phone');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the patient owns this appointment
        if (appointment.patientId.toString() !== patientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        return res.json({
            message: 'Appointment retrieved successfully',
            data: formatAppointmentResponse(appointment)
        });

    } catch (error) {
        console.error('Error getting appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an appointment
export const updateAppointment = async(req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;

        // Validate request body
        const { error, value } = updateAppointmentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                details: error.details.map(d => d.message)
            });
        }

        // Find the appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the patient owns this appointment
        if (appointment.patientId.toString() !== patientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if appointment can be updated
        if (!appointment.canBeRescheduled()) {
            return res.status(400).json({
                message: 'Appointment cannot be updated',
                details: ['Appointments can only be updated more than 12 hours before the scheduled time']
            });
        }

        // If date or time is being changed, we need to handle slot management
        if (value.date || value.timeSlot) {
            const oldDate = appointment.date;
            const oldTimeSlot = appointment.timeSlot;
            const newDate = value.date || appointment.date;
            const newTimeSlot = value.timeSlot || appointment.timeSlot;

            // Release the old slot
            const doctor = await Doctor.findById(appointment.doctorId);
            if (doctor) {
                doctor.releaseSlot(appointment._id);
                await doctor.save();
            }

            // Check if new slot is available
            if (value.date || value.timeSlot) {
                const updatedDoctor = await Doctor.findById(appointment.doctorId);
                const availableSlots = updatedDoctor.getAvailableSlotsForDate(newDate);
                const requestedSlot = availableSlots.find(slot => slot.timeSlot === newTimeSlot);

                if (!requestedSlot) {
                    return res.status(400).json({
                        message: 'Selected time slot is not available',
                        details: ['Please choose from the available slots']
                    });
                }

                // Book the new slot
                const slotBooked = updatedDoctor.bookSlot(newDate, newTimeSlot, appointment._id);
                if (!slotBooked) {
                    return res.status(400).json({ message: 'Failed to book the selected time slot' });
                }

                await updatedDoctor.save();
            }
        }

        // Update the appointment
        Object.assign(appointment, value);
        await appointment.save();

        // Populate doctor details for response
        await appointment.populate('doctorId', 'name specialization');

        return res.json({
            message: 'Appointment updated successfully',
            data: formatAppointmentResponse(appointment)
        });

    } catch (error) {
        console.error('Error updating appointment:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                details: [error.message]
            });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Cancel an appointment
export const cancelAppointment = async(req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;

        // Validate request body
        const { error, value } = cancelAppointmentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                details: error.details.map(d => d.message)
            });
        }

        const { cancellationReason } = value;

        // Find the appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the patient owns this appointment
        if (appointment.patientId.toString() !== patientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if appointment can be cancelled
        if (!appointment.canBeCancelled()) {
            return res.status(400).json({
                message: 'Appointment cannot be cancelled',
                details: ['Appointments can only be cancelled more than 24 hours before the scheduled time']
            });
        }

        // Update appointment status
        appointment.status = 'cancelled';
        appointment.cancelledBy = patientId;
        appointment.cancellationReason = cancellationReason;
        await appointment.save();

        // Release the slot in the doctor's schedule
        const doctor = await Doctor.findById(appointment.doctorId);
        if (doctor) {
            doctor.releaseSlot(appointment._id);
            await doctor.save();
        }

        return res.json({
            message: 'Appointment cancelled successfully',
            data: formatAppointmentResponse(appointment)
        });

    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all doctors (for patient to choose from)
export const getAllDoctors = async(req, res) => {
    try {
        const { specialization, page = 1, limit = 10 } = req.query;

        // Build query
        const query = { isActive: true };
        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const doctors = await Doctor.find(query)
            .select('name specialization qualifications experience')
            .sort({ name: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Doctor.countDocuments(query);

        return res.json({
            message: 'Doctors retrieved successfully',
            data: {
                doctors,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error getting doctors:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};