import * as fs from "fs";
import * as csv from "fast-csv";

abstract class CsvFileWriter {
  path: string;
  constructor(path: string) {
    this.path = path;
  }
  abstract addRow(row: any): Promise<void>;
}

export interface DataRow {
  [key: string]: string;
}

export class FastCsvFileWriter extends CsvFileWriter {
  csvStream: csv.CsvFormatterStream<csv.FormatterRow, csv.FormatterRow>;

  constructor(path: string) {
    super(path);
    this.csvStream = csv.format({ headers: false });
  }
  async initFile(headers: string[]): Promise<void> {
    const writableStream = fs.createWriteStream(this.path);
    writableStream.on("finish", () => {
      console.log("CSV file initialized successfully");
    });

    const writeCsv = () =>
      new Promise<void>((resolve, reject) => {
        this.csvStream.pipe(writableStream);
        this.csvStream.write(headers);
        writableStream.write("\n");
        this.csvStream.end();
        resolve();
      });

    await writeCsv();
  }
  async addRow(row: DataRow): Promise<void> {
    const writableStream = fs.createWriteStream(this.path, { flags: "a" });

    writableStream.on("finish", () => {
      console.log("CSV file written successfully");
    });

    const writeCsv = () =>
      new Promise<void>((resolve, reject) => {
        this.csvStream.pipe(writableStream);
        this.csvStream.write(Object.values(row));
        writableStream.write("\n");
        this.csvStream.end();
        resolve();
      });

    await writeCsv();
  }
}
