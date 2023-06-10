import {
  AIChatMessage,
  BaseChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import TestVariant from "./TestVariant";
import { DataRow, FastCsvFileWriter } from "./CsvFileWriter";

export interface TestResult {
  response: AIChatMessage;
}

export default abstract class TestResultsWriter {
  columns: string[];
  variants: TestVariant[];
  constructor(columns: string[], variants: TestVariant[]) {
    this.columns = columns;
    this.variants = variants;
  }
  abstract beforeAll(
    times: number,
    currentIterationCount: number
  ): Promise<void>;
  abstract beforeEach(variant: TestVariant, i: number): Promise<void>;
  abstract afterAll(results: TestResult[]): Promise<void>;
  abstract afterEach(
    result: TestResult,
    variant: TestVariant,
    i: number
  ): Promise<void>;
}

export class CsvTestResultsWriter extends TestResultsWriter {
  fileWriter: FastCsvFileWriter;
  outputColumns: string[];

  constructor(columns: string[], variants: TestVariant[]) {
    super(columns, variants);
    this.fileWriter = new FastCsvFileWriter("output.csv");
    this.outputColumns = ["variant", ...columns, "results", "score"];
  }

  async beforeAll(times: number, i: number) {
    console.log(
      `< initiating test run ${i + 1} out of ${times} for ${
        this.variants.length
      } variants >`
    );
    
    await this.fileWriter.initFile(this.outputColumns);
  }

  async beforeEach(variant: TestVariant, i: number) {
    console.log(`< running test ${i} out of ${this.variants.length} >`);
  }

  async afterAll(results: TestResult[]) {
    console.log(`< test run complete for ${results.length} tests >`);
  }

  async afterEach(result: TestResult, variant: TestVariant, i: number) {
    const csv = new FastCsvFileWriter("output.csv");
    const row = this.buildCsvRow(variant, result.response.text, i);
    await csv.addRow(row);
  }

  

  private buildCsvRow(
    variant: TestVariant,
    results: string,
    i: number
  ): DataRow {
    const csvRow= {
      variant: i.toString(),
      ...variant.originalDataRow,
      results: results,
      score: ""
    };

    if (!this.doesRowComplyWithColumns(csvRow)) {
      throw new Error("Row does not comply with columns");
    }

    return csvRow;
  }

  private doesRowComplyWithColumns(row: DataRow): boolean {
    const rowKeys = Object.keys(row);
    const columnKeys = this.outputColumns;
    const rowKeysSet = new Set(rowKeys);
    const columnKeysSet = new Set(columnKeys);

    return rowKeysSet.size === columnKeysSet.size;
  }
}

export class ConsoleTestResultsWriter extends TestResultsWriter {
  async beforeAll(times: number, i: number) {
    console.log(
      `  < initiating test run ${i + 1} out of ${times} for ${
        this.variants.length
      } variants >`
    );
  }
  async beforeEach(variant: TestVariant, i: number) {
    const { temperature, model, messages } = variant;
    console.log(`/*\nprompt ${i}\ntemp: ${temperature}\nmodel: ${model} 
  ${buildPromptsComment(messages)} \n*/\n`);
  }
  async afterAll(results: TestResult[]) {
    console.log(`< test run complete for ${results.length} tests >`);
  }
  async afterEach(result: TestResult, variant: TestVariant, i: number) {
    console.log(`--llm response ${i}--\n`);
    console.log(result.response.text + "\n");
    console.log("-----------------------------------\n");
  }
}

function buildPromptsComment(messages: BaseChatMessage[] = []) {
  return messages.map((message) => {
    if (message instanceof HumanChatMessage) {
      return `\nhuman: ${message.text}`;
    } else if (message instanceof SystemChatMessage) {
      return `\nsystem: ${message.text}`;
    } else if (message instanceof AIChatMessage) {
      return `\nai: ${message.text}`;
    }
  });
}
