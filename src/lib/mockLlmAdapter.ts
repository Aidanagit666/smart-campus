export interface LlmAdapter {
  complete(prompt: string): Promise<string>;
}

interface PromptFacts {
  roomName: string;
  startLabel: string;
  endLabel: string;
  available: boolean;
  messages: string[];
}

export function createMockLlmAdapter(): LlmAdapter {
  return {
    async complete(prompt: string): Promise<string> {
      const data = JSON.parse(prompt) as PromptFacts;
      const status = data.available ? 'available' : 'unavailable';
      const summary = `${data.roomName} is ${status} from ${data.startLabel} to ${data.endLabel}.` +
        (data.available ? '' : ` ${data.messages.join(' ')}`);
      return JSON.stringify({ status, summary, citations: data.available ? [] : data.messages });
    },
  };
}
