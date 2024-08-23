import { AgentRuntime } from "../core/runtime.ts";
import { Action, Message } from "../core/types.ts";

export default {  
  name: "MUTE_ROOM",
  description: "Mutes a room, ignoring all messages unless explicitly mentioned.",
  validate: async (runtime: AgentRuntime, message: Message) => {
    const roomId = message.room_id;
    const userState = await runtime.databaseAdapter.getParticipantUserState(roomId, runtime.agentId);
    return userState !== 'MUTED';
  },
  handler: async (runtime: AgentRuntime, message: Message) => {
    await runtime.databaseAdapter.setParticipantUserState(message.room_id, runtime.agentId, 'MUTED');
  },  
  condition: "The user wants to ignore a room unless explicitly mentioned.",
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          content: "{{agentName}}, please mute this channel. No need to respond here for now.",  
          action: "WAIT"
        }
      },
      { 
        user: "{{agentName}}",
        content: {
          content: "Got it, I'll mute this room and refrain from considering it until unmuted.",
          action: "MUTE_ROOM"
        }
      },
      {
        user: "{{user2}}",   
        content: {
          content: "@{{agentName}} We could really use your input on this!",
          action: "WAIT" 
        }
      }
    ],  
    [
      {
        user: "{{user1}}",
        content: {
          content: "{{agentName}}, let's have you mute this channel for the time being.",
          action: "WAIT"
        }  
      },
      {
        user: "{{agentName}}",
        content: {
          content: "Understood, muting this room now. I won't respond here until instructed otherwise.",  
          action: "MUTE_ROOM"
        }
      },
      { 
        user: "{{user2}}",
        content: {
          content: "Hey @{{agentName}}, what do you think about this new design?",
          action: "WAIT"
        }  
      },
      {
        user: "{{user2}}",   
        content: {
          content: "Hmm, usually {{agentName}} is pretty responsive. Wonder what's up.",
          action: "WAIT"
        }
      }
    ]
  ]
} as Action;