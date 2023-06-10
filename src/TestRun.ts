import { time } from "console";
import TestResultsWriter, { TestResult } from "./TestResultsWriter";
import TestVariant from "./TestVariant";
import llMChat from "./llmChat";

export default class TestRun {
  variants: TestVariant[];
  columns: string[];
  results: TestResult[] = [];
  testResultsWriter: TestResultsWriter;

  constructor({
    variants,
    columns,
    TestResultsWriter,
  }: {
    variants: TestVariant[];
    columns: string[];
    TestResultsWriter: any;
  }) {
    this.variants = variants;
    this.columns = columns;
    this.testResultsWriter = new TestResultsWriter(columns, variants);
  }

  async run(times: number) {
    let timesRemaining = times;
    let totalTestIterations = 0;
    await this.testResultsWriter.beforeAll(times, totalTestIterations);

    while (timesRemaining > 0) {
      let currentTestIteration = 1;
      for (const variant of this.variants) {
        const { temperature, model, messages } = variant;
        await this.testResultsWriter.beforeEach(variant, currentTestIteration);

        const response = await llMChat({
          messages,
          temperature: Number(temperature),
          modelName: model,
        });
        this.results.push({ response });
        await this.testResultsWriter.afterEach(
          { response },
          variant,
          currentTestIteration
        );
        totalTestIterations++;
        currentTestIteration++;
      }
      timesRemaining--;
    } 
    await this.testResultsWriter.afterAll(this.results);
  }
}
