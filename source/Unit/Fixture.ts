// The MIT License (MIT)
//
// Copyright (c) 2016 Simon Mika
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Test } from "./Test"
import { TestFailedError } from "./TestFailedError"
import * as Uri from "../Uri"
import * as Error from "../Error"
import * as Constraints from "./Constraints"
import * as Utilities from "../Utilities"
import { ErrorHandler } from "./ErrorHandler"

export abstract class Fixture {
	private tests: Test[] = []
	private expectCounter = 0
	private errorHandler: Error.Handler
	constructor(readonly name: string, private reportOnPass?: boolean) {
		if (reportOnPass == undefined)
			this.reportOnPass = true
		this.errorHandler = new ErrorHandler(new Error.ConsoleHandler(), new Error.Region(new Uri.Locator([ "test" ], Uri.Authority.parse(name))))
	}
	add(name: string, action: () => void): void {
		this.tests.push(new Test(name, action))
	}
	run(debug?: boolean): boolean {
		const failures: TestFailedError[] = []
		let result = true
		this.tests.forEach(test => {
			if (debug)
				test.run()
			else {
				try {
					test.run()
				} catch (error) {
					if (error instanceof TestFailedError) {
						const e = error as TestFailedError
						e.test = test
						e.expectId = this.expectCounter
						failures.push(e)
						result = false
					} else {
						console.dir("[Fixture]", error)
						throw error
					}
				}
			}
			this.expectCounter = 0
		})
		if ((result && this.reportOnPass) || !result)
			this.prettyPrintTestResult(result)
		if (!result) {
			failures.forEach(failure => {
				const expectedMessage = "expected '" + JSON.stringify(failure.constraint.expectedValue) + "', found '" + JSON.stringify(failure.value) + "'"
				const whereMessage = "[expect #" + failure.expectId + " in '" + (failure.test ? failure.test.toString() : "") + "']"
				this.errorHandler.raise("  -> " + expectedMessage + " " + whereMessage)
			})
		}
		return result
	}
	expect(value: any, constraint?: Constraints.Constraint): void {
		this.expectCounter++
		if (!constraint)
			constraint = new Constraints.TrueConstraint()
		if (!constraint.verify(value))
			throw new TestFailedError(value, constraint)
	}
	//
	// This is a temporary thing to make it easier on the eyes when reading
	// test results in the terminal.
	//
	private prettyPrintTestResult(success: boolean) {
		const coloredString = "\x1b[" + (success ? "32mpassed" : "31mfailed")
		const colorReset = "\x1b[0m"
		const message = coloredString + colorReset
		const result = Utilities.String.padRight(this.name, ".", 50) + ": " + message
		console.log(result)
	}

	private static fixtures: Fixture[] = []
	static add(fixture: Fixture) {
		Fixture.fixtures.push(fixture)
	}
	static run(debug?: boolean): boolean {
		return Fixture.fixtures.reduce((s, fixture) => fixture.run(debug) || s, false)
	}
}
