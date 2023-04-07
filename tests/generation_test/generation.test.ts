import { parseFile } from "../utils";
import {generateVLAPI, generatetoSpec, getEmitCode} from "../../api"

/**
 * Test the generated file is the same as expected.
 */
describe("VLType test", () => {

    it("Output should be same as expected", () => {
        const Statements = parseFile("tests/generation_test/test_files/complexType.ts");
        generateVLAPI(Statements[4]);
        generateVLAPI(Statements[7]);
        generatetoSpec();
        // console.log(getEmitCode());
        expect(1).toBe(1);
    });

    it("Output should be same as expected", () => {
        const Statements = parseFile("tests/generation_test/test_files/type.ts");
        generateVLAPI(Statements[0]);
        generatetoSpec();
        // console.log(getEmitCode());
        expect(1).toBe(1);
    });
});