import { MeetingState } from "../models/meetingState.model.js";

const saveMeetingState = async (meetingCode, participants, chatHistory, transcript = []) => {
    try {
        let meetingState = await MeetingState.findOne({ meetingCode, isActive: true });

        if (!meetingState) {
            meetingState = new MeetingState({
                meetingCode,
                participants,
                chatHistory,
                transcript,
                meetingStartTime: new Date(),
                metadata: {
                    totalMessages: chatHistory.length,
                    totalParticipants: participants.length
                }
            });
        } else {
            meetingState.participants = participants;
            meetingState.chatHistory = chatHistory;
            meetingState.transcript = transcript;
            meetingState.lastActivity = new Date();
            meetingState.metadata.totalMessages = chatHistory.length;
            meetingState.metadata.totalParticipants = participants.length;
        }

        await meetingState.save();
        return meetingState;
    } catch (error) {
        console.error('Error saving meeting state:', error);
        return null;
    }
};

const getMeetingState = async (meetingCode) => {
    try {
        const meetingState = await MeetingState.findOne({ meetingCode, isActive: true });
        return meetingState;
    } catch (error) {
        console.error('Error getting meeting state:', error);
        return null;
    }
};

const updateParticipantStatus = async (meetingCode, socketId, status, username = null) => {
    try {
        const meetingState = await MeetingState.findOne({ meetingCode, isActive: true });
        
        if (!meetingState) {
            return null;
        }

        const participantIndex = meetingState.participants.findIndex(p => p.socketId === socketId);

        if (participantIndex !== -1) {
            meetingState.participants[participantIndex].connectionState = status;
            meetingState.participants[participantIndex].lastSeen = new Date();
            
            if (status === 'disconnected') {
                meetingState.participants[participantIndex].isActive = false;
            } else if (status === 'connected') {
                meetingState.participants[participantIndex].isActive = true;
            }
        } else if (status === 'connected') {
            meetingState.participants.push({
                socketId,
                username: username || 'Anonymous',
                joinTime: new Date(),
                lastSeen: new Date(),
                isActive: true,
                connectionState: 'connected'
            });
            meetingState.metadata.totalParticipants = meetingState.participants.length;
        }

        meetingState.lastActivity = new Date();
        await meetingState.save();
        return meetingState;
    } catch (error) {
        console.error('Error updating participant status:', error);
        return null;
    }
};

const addChatMessage = async (meetingCode, sender, message, socketId) => {
    try {
        const meetingState = await MeetingState.findOne({ meetingCode, isActive: true });
        
        if (!meetingState) {
            return null;
        }

        meetingState.chatHistory.push({
            sender,
            message,
            socketId,
            timestamp: new Date()
        });

        meetingState.metadata.totalMessages = meetingState.chatHistory.length;
        meetingState.lastActivity = new Date();
        
        await meetingState.save();
        return meetingState;
    } catch (error) {
        console.error('Error adding chat message:', error);
        return null;
    }
};

const handleReconnection = async (meetingCode, oldSocketId, newSocketId, username) => {
    try {
        const meetingState = await MeetingState.findOne({ meetingCode, isActive: true });
        
        if (!meetingState) {
            return null;
        }

        const participantIndex = meetingState.participants.findIndex(
            p => p.socketId === oldSocketId || p.username === username
        );

        if (participantIndex !== -1) {
            meetingState.participants[participantIndex].socketId = newSocketId;
            meetingState.participants[participantIndex].connectionState = 'connected';
            meetingState.participants[participantIndex].isActive = true;
            meetingState.participants[participantIndex].lastSeen = new Date();
            meetingState.metadata.reconnectionCount += 1;
        } else {
            meetingState.participants.push({
                socketId: newSocketId,
                username: username || 'Anonymous',
                joinTime: new Date(),
                lastSeen: new Date(),
                isActive: true,
                connectionState: 'connected'
            });
        }

        meetingState.lastActivity = new Date();
        await meetingState.save();
        
        return {
            chatHistory: meetingState.chatHistory,
            participants: meetingState.participants,
            transcript: meetingState.transcript,
            meetingStartTime: meetingState.meetingStartTime
        };
    } catch (error) {
        console.error('Error handling reconnection:', error);
        return null;
    }
};

const closeMeetingState = async (meetingCode) => {
    try {
        const meetingState = await MeetingState.findOne({ meetingCode, isActive: true });
        
        if (meetingState) {
            meetingState.isActive = false;
            await meetingState.save();
        }
        
        return meetingState;
    } catch (error) {
        console.error('Error closing meeting state:', error);
        return null;
    }
};

export {
    saveMeetingState,
    getMeetingState,
    updateParticipantStatus,
    addChatMessage,
    handleReconnection,
    closeMeetingState
};
