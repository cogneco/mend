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

/// <reference path="../../Error/ConsoleHandler" />
/// <reference path="../../Error/Position" />
/// <reference path="../../Error/Location" />
/// <reference path="../../Error/Region" />
/// <reference path="../../IO/StringReader" />
/// <reference path="../../Unit/Fixture" />
/// <reference path="../../Unit/Constraints/Is" />

module U10sil.IO.Tests {
	import Is = Unit.Constraints.Is
	export class StringReaderTest extends Unit.Fixture {
		constructor() {
			super("StringReader")
			var errorHandler = new Error.ConsoleHandler()
			this.add("empty", () => {
				var sr = new IO.StringReader("")
				this.expect(sr.isEmpty())
				this.expect(sr.getResource() === "")
			})
			this.add("simple string", () => {
				var sr = new IO.StringReader("abcdef")
				this.expect(sr.read() === "a")
				this.expect(sr.read() === "b")
				this.expect(sr.read() === "c")
				this.expect(sr.read() === "d")
				this.expect(sr.read() === "e")
				this.expect(sr.read() === "f")
			})
			this.add("simple string with location", () => {
				var sr = new IO.StringReader("abc\ndef")
				this.expect(sr.getLocation().getColumn() === 1 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 2 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 3 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 4 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 1 && sr.getLocation().getLine() === 2)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 2 && sr.getLocation().getLine() === 2)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 3 && sr.getLocation().getLine() === 2)
				sr.read()
				this.expect(sr.isEmpty())
			})
			this.add("tabs and newlines", () => {
				var sr = new IO.StringReader("\t\t\t\n\t\t\t")
				this.expect(sr.getLocation().getColumn() === 1 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 2 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 3 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 4 && sr.getLocation().getLine() === 1)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 1 && sr.getLocation().getLine() === 2)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 2 && sr.getLocation().getLine() === 2)
				sr.read()
				this.expect(sr.getLocation().getColumn() === 3 && sr.getLocation().getLine() === 2)
				sr.read()
				this.expect(sr.isEmpty())
			})
			this.add("mark", () => {
				var sr = new IO.StringReader("abc\0")
				sr.mark()
				sr.read(); sr.read(); sr.read()
				var region = sr.getRegion()
				this.expect(region.getStart().getLine() === 1 && region.getStart().getColumn() === 1)
				this.expect(region.getEnd().getLine() === 1 && region.getEnd().getColumn() === 4)
			})
		}
	}
}
