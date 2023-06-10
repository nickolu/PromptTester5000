import { BaseChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

export default async function llMChat({
  messages,
  modelName,
  temperature = 0.7,
}: {
  messages: BaseChatMessage[];
  temperature: number;
  modelName: string;
}): Promise<BaseChatMessage> {
  const chat = new ChatOpenAI({ temperature, modelName });
  const response = await chat.call(messages);
  return response;
}
