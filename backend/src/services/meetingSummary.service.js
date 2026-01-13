import { MeetingSummary } from "../models/meetingSummary.model.js";

const generateMeetingSummary = (participants, messages, duration) => {
    const totalParticipants = participants.length;
    const totalMessages = messages.length;
    const durationMinutes = Math.floor(duration / 60000);
    
    const participantSummary = participants.map(p => {
        const timeSpentMinutes = Math.floor(p.timeSpent / 60000);
        return `Participant joined for ${timeSpentMinutes} minutes`;
    }).join(', ');
    
    const messageSummary = totalMessages > 0 
        ? `${totalMessages} messages were exchanged during the meeting.` 
        : 'No messages were exchanged.';
    
    const summary = `Meeting Summary:
- Duration: ${durationMinutes} minutes
- Total Participants: ${totalParticipants}
- ${messageSummary}
- Participant Activity: ${participantSummary || 'No detailed participant data'}`;
    
    return summary;
};

const createMeetingSummary = async (meetingCode) => {
    try {
        console.log(`Creating meeting summary for: ${meetingCode}`);
        const summary = new MeetingSummary({
            meetingCode,
            startTime: new Date(),
            status: 'active'
        });
        await summary.save();
        console.log(`Meeting summary created successfully for: ${meetingCode}`);
        return summary;
    } catch (error) {
        console.error('Error creating meeting summary:', error);
        return null;
    }
};

const updateMeetingSummary = async (meetingCode, updateData) => {
    try {
        const summary = await MeetingSummary.findOne({ 
            meetingCode, 
            status: 'active' 
        });
        
        if (!summary) {
            return null;
        }
        
        Object.assign(summary, updateData);
        await summary.save();
        return summary;
    } catch (error) {
        console.error('Error updating meeting summary:', error);
        return null;
    }
};

const completeMeetingSummary = async (meetingCode, participants, messages) => {
    try {
        console.log(`Completing meeting summary for: ${meetingCode}`);
        console.log(`Participants: ${participants.length}, Messages: ${messages.length}`);

        const summary = await MeetingSummary.findOne({
            meetingCode,
            status: 'active'
        });

        if (!summary) {
            console.log(`No active summary found for meeting: ${meetingCode}`);
            return null;
        }

        const endTime = new Date();
        const duration = endTime - summary.startTime;

        summary.endTime = endTime;
        summary.duration = duration;
        summary.participants = participants;
        summary.messages = messages;
        summary.totalParticipants = participants.length;
        summary.summary = generateMeetingSummary(participants, messages, duration);
        summary.status = 'completed';

        await summary.save();
        console.log(`Meeting summary completed successfully for: ${meetingCode}`);
        return summary;
    } catch (error) {
        console.error('Error completing meeting summary:', error);
        return null;
    }
};

export { 
    generateMeetingSummary, 
    createMeetingSummary, 
    updateMeetingSummary,
    completeMeetingSummary 
};
