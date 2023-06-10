
import 'dotenv/config'
import TestRun from "./src/TestRun";
import { TestVariantsCsvFileReader } from "./src/CsvFileReader";
import { CsvTestResultsWriter } from "./src/TestResultsWriter";

async function mainAsync() {
  const csvReader = new TestVariantsCsvFileReader("test-variants-input.csv");
  const columns = await csvReader.getHeaders();
  const variants = await csvReader.csvRowsToTestVariants();

  const testRun = new TestRun({
    variants,
    columns,
    TestResultsWriter: CsvTestResultsWriter,
  });
  await testRun.run(5);

  return {
    variants,
    results: testRun.results,
  };
}

function main() {
  console.log("< RUNNING TESTS >");
  mainAsync()
    .then(() => {
      console.log("< DONE RUNNING TESTS >");
    })
    .catch((error) => {
      console.error(error);
    });
}
main();
