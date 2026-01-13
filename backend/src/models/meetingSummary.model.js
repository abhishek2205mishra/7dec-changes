import mongoose, { Schema } from "mongoose";

const meetingSummarySchema = new Schema(
    {
        meetingCode: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date },
        duration: { type: Number },
        participants: [{
            socketId: String,
            joinTime: Date,
            leaveTime: Date,
            timeSpent: Number
        }],
        messages: [{
            sender: String,
            data: String,
            timestamp: { type: Date, default: Date.now }
        }],
        summary: { type: String },
        totalParticipants: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'completed'], default: 'active' }
    },
    { timestamps: true }
)

const MeetingSummary = mongoose.model("MeetingSummary", meetingSummarySchema);

export { MeetingSummary };
