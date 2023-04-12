import { parseFile, validateOutput } from "../utils";
import { generateVLAPI, generatetoSpec, getEmitCode } from "../../api"
import * as fs from 'fs';
import exp from "constants";

/**
 * Test the generated file is the same as expected.
 */
describe("VLType test", () => {

    it("Output should be same as expected", () => {
        const input_file_path = "tests/generation_test/test_files";
        const expected_file_path = "tests/generation_test/expected_generated_files";
        // const input_file = `${input_file_path}/enumType.ts`
        // const expected_file = `${expected_file_path}/enumType.txt`
        validateOutput(input_file_path + "/complexType.ts", expected_file_path + "/complexType.txt");

        // TODO: clear the emit code and support multiple files
        // validateOutput("tests/generation_test/test_files/complexType.ts", "tests/generation_test/expected_generated_files/complexType.txt");
    });

});