import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import { MeetingSummary } from "../models/meetingSummary.model.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0, token: 0 });
        res.status(httpStatus.OK).json({ users, total: users.length });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ date: -1 });
        res.status(httpStatus.OK).json({ meetings, total: meetings.length });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

const getAllMeetingSummaries = async (req, res) => {
    try {
        const summaries = await MeetingSummary.find().sort({ startTime: -1 });
        res.status(httpStatus.OK).json({ summaries, total: summaries.length });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

const getMeetingSummaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const summary = await MeetingSummary.findById(id);
        
        if (!summary) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting summary not found" });
        }
        
        res.status(httpStatus.OK).json(summary);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMeetings = await Meeting.countDocuments();
        const totalSummaries = await MeetingSummary.countDocuments();
        const activeMeetings = await MeetingSummary.countDocuments({ status: 'active' });
        const completedMeetings = await MeetingSummary.countDocuments({ status: 'completed' });

        const recentMeetings = await MeetingSummary.find()
            .sort({ startTime: -1 })
            .limit(10);

        const totalDuration = await MeetingSummary.aggregate([
            { $match: { duration: { $exists: true } } },
            { $group: { _id: null, total: { $sum: "$duration" } } }
        ]);

        res.status(httpStatus.OK).json({
            stats: {
                totalUsers,
                totalMeetings,
                totalSummaries,
                activeMeetings,
                completedMeetings,
                totalDuration: totalDuration[0]?.total || 0
            },
            recentMeetings
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, username, password, isAdmin } = req.body;

        if (!name || !username || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Name, username, and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            isAdmin: isAdmin || false
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        await Meeting.deleteMany({ user_id: user.username });

        await User.findByIdAndDelete(id);

        res.status(httpStatus.OK).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

const deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;

        const meeting = await Meeting.findByIdAndDelete(id);

        if (!meeting) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting not found" });
        }

        res.status(httpStatus.OK).json({ message: "Meeting deleted successfully" });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

export {
    getAllUsers,
    getAllMeetings,
    getAllMeetingSummaries,
    getMeetingSummaryById,
    getDashboardStats,
    createUser,
    deleteUser,
    deleteMeeting
};
