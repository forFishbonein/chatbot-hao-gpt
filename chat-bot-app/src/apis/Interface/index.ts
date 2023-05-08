// 类型
export interface promptType {
  message: string;
}
export interface resultMessagesType {
  content: string;
  isBot: boolean;
}
export interface dialogueType {
  content: string;
  isBot: boolean;
}
export interface oneHistoryType {
  id: number;
  title: string;
  dialogues: dialogueType[];
}
