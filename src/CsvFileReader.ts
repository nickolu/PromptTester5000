import { createReadStream } from "fs";
import TestVariant from "./TestVariant";
import {
  AIChatMessage,
  BaseChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import csvParser from "csv-parser";

interface DataRow {
  [key: string]: string;
}

const data: DataRow[] = [];

abstract class CsvFileReader {
  private path: string;
  constructor(path: string) {
    this.path = path;
  }
  public async getRows(start: number = 0, end?: number): Promise<DataRow[]> {
    const data: DataRow[] = [];
    let rowNumber = start;

    return new Promise((resolve, reject) => {
      createReadStream(this.path)
        .pipe(csvParser())
        .on("data", (row: DataRow) => {
          if (rowNumber >= start && (end === undefined || rowNumber <= end)) {
            data.push(row);
          }
          rowNumber++;
        })
        .on("end", () => {
          console.log("CSV file successfully processed");
          resolve(data);
        })
        .on("error", (err) => {
          console.error("An error occurred:", err);
          reject(err);
        });
    });
  }
  public async getHeaders(): Promise<string[]> {
    const headers = await this.getRows(0, 0);
    return Object.keys(headers[0]);
  }
  public async getRow(rowNumber: number): Promise<DataRow> {
    const rows = await this.getRows(rowNumber, rowNumber);
    return rows[0];
  }
}

export class TestVariantsCsvFileReader extends CsvFileReader {
  constructor(path: string) {
    super(path);
  }
  public async csvRowsToTestVariants() {
    const rows = await this.getRows(1);
    
    return rows.map((row) => {
      const { temperature, model, description, } = row;
      const columns = Object.keys(row);
      return new TestVariant({
        temperature: Number(temperature),
        model,
        messages: getMessagesFromRow(row, columns),
        columns,
        description,
        originalDataRow: row
      });
    });
  }
}

function getMessagesFromRow(row: DataRow, columns: string[]): BaseChatMessage[] {
  const messages: BaseChatMessage[] = [];

  columns.forEach((columnName: string) => {
    const value = row[columnName];
    if (value) {
      if (columnName.startsWith("human")) {
        messages.push(new HumanChatMessage(value));
      } else if (columnName.startsWith("system")) {
        messages.push(new SystemChatMessage(value));
      } else if (columnName.startsWith("ai")) {
        messages.push(new AIChatMessage(value));
      }
    }
  });
  return messages;
}
