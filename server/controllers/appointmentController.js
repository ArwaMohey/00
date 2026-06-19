const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const toClientAppointment = (appointment) => ({
  _id: appointment._id,
  date: appointment.date,
  status: appointment.status,
  studentId: appointment.studentId?._id || appointment.studentId,
  doctorId: appointment.doctorId?._id || appointment.doctorId,
  student: appointment.studentId || null,
  doctor: appointment.doctorId || null,
  createdAt: appointment.createdAt,
  updatedAt: appointment.updatedAt
});

exports.getAppointments = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { studentId: req.user._id };

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialization')
      .populate('studentId', 'name email studentId')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: appointments.map(toClientAppointment)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, status } = req.body;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor and date are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }

    const doctorExists = await Doctor.exists({ _id: doctorId });
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const appointment = await Appointment.create({
      studentId: req.user._id,
      doctorId,
      date,
      status: status || 'Confirmed'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specialization')
      .populate('studentId', 'name email studentId');

    res.status(201).json({
      success: true,
      data: toClientAppointment(populatedAppointment)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment'
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const canDelete =
      req.user.role === 'admin' || appointment.studentId.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment'
    });
  }
};
