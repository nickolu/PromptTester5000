import { BaseChatMessage } from "langchain/schema";
import { DataRow } from "./CsvFileWriter";

export default class TestVariant {
  temperature: number;
  model: string;
  description: string;
  columns: string[];
  messages: BaseChatMessage[] = [];
  originalDataRow: DataRow;

  constructor({
    temperature,
    model,
    description,
    columns,
    messages,
    originalDataRow
  }: {
    temperature: number;
    model: string;
    description: string;
    columns: string[];
    messages: BaseChatMessage[];
    originalDataRow: DataRow;
  }) {
    this.temperature = temperature;
    this.model = model;
    this.description = description;
    this.columns = columns;
    this.messages = messages;
    this.originalDataRow = originalDataRow;
  }


}
