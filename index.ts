import "dotenv/config";
import TestRun from "./src/TestRun";
import { TestVariantsCsvFileReader } from "./src/CsvFileReader";
import { CsvTestResultsWriter } from "./src/TestResultsWriter";
import * as readline from "readline";

const TEST_ITERATION_TIMES = '2';
const INPUT_FILE_NAME = "test-input.csv";
const OUTPUT_FILE_NAME = `test-output/output-${new Date()
  .toISOString()
  .replace(/:/g, "-")}.csv`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function mainAsync(inputFileName: string, outputFileName: string, times: number) {
  const csvReader = new TestVariantsCsvFileReader(inputFileName);
  const columns = await csvReader.getHeaders();
  const variants = await csvReader.csvRowsToTestVariants();

  const testRun = new TestRun({
    variants,
    columns,
    options: {
      inputFileName,
      outputFileName,
    },
    TestResultsWriter: CsvTestResultsWriter,
  });
  await testRun.run(times);

  return {
    variants,
    results: testRun.results,
  };
}

function main() {
  console.log("< RUNNING TESTS >");
  rl.question("Input File Path (test-input.csv) ", (inputFileName) => {
    inputFileName = inputFileName || INPUT_FILE_NAME;
    console.log("selected input: ", inputFileName);
    rl.question(
      "Ouptut File Path (test-output/output<datestamp>.csv) ",
      (outputFileName) => {
        outputFileName = outputFileName || OUTPUT_FILE_NAME;
        console.log("selected output: ", outputFileName);

        rl.question("number of times to run tests (2) ", (times) => {
          times = times || TEST_ITERATION_TIMES;
          console.log("selected times: ", times);
          rl.close();
          mainAsync(inputFileName, outputFileName, Number(times))
            .then(() => {
              console.log("< DONE RUNNING TESTS >");
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    );
  });
}
main();
