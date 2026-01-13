import mongoose, { Schema } from "mongoose";

const meetingStateSchema = new Schema(
    {
        meetingCode: { type: String, required: true, index: true },
        participants: [{
            socketId: String,
            userId: String,
            username: String,
            joinTime: Date,
            lastSeen: Date,
            isActive: { type: Boolean, default: true },
            connectionState: { type: String, enum: ['connected', 'disconnected', 'reconnecting'], default: 'connected' }
        }],
        chatHistory: [{
            sender: String,
            message: String,
            timestamp: { type: Date, default: Date.now },
            socketId: String
        }],
        transcript: [{
            speaker: String,
            text: String,
            timestamp: { type: Date, default: Date.now }
        }],
        meetingStartTime: { type: Date, default: Date.now },
        lastActivity: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
        metadata: {
            totalMessages: { type: Number, default: 0 },
            totalParticipants: { type: Number, default: 0 },
            reconnectionCount: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

meetingStateSchema.index({ meetingCode: 1, 'participants.socketId': 1 });
meetingStateSchema.index({ lastActivity: 1 });

const MeetingState = mongoose.model("MeetingState", meetingStateSchema);

export { MeetingState };
