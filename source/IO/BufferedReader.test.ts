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

import * as Error from "../Error"
import { Fixture, Is } from "../Unit"
import { StringReader } from "./StringReader"
import { BufferedReader } from "./BufferedReader"

export class BufferedReaderTest extends Fixture {
	constructor() {
		super("IO.BufferedReader")
		var errorHandler = new Error.ConsoleHandler()
		this.add("empty", () => {
			var br = new BufferedReader(new StringReader(""))
			this.expect(br.isEmpty())
		})
		this.add("state check", () => {
			var br = new BufferedReader(new StringReader(""))
			this.expect(br.getLocation(), Is.Not().NullOrUndefined())
			this.expect(br.getRegion(), Is.Not().NullOrUndefined())
			this.expect(br.getResource(), Is.Not().NullOrUndefined())
		})
		this.add("peek", () => {
			var br = new BufferedReader(new StringReader("foobar"))
			this.expect(br.peek(1), Is.Equal().To("f"))
			this.expect(br.peek(2), Is.Equal().To("fo"))
			this.expect(br.peek(3), Is.Equal().To("foo"))
			this.expect(br.peek(4), Is.Equal().To("foob"))
			this.expect(br.peek(5), Is.Equal().To("fooba"))
			this.expect(br.peek(6), Is.Equal().To("foobar"))
		})
		this.add("read one at a time", () => {
			var br = new BufferedReader(new StringReader("abcdef"))
			this.expect(br.read(), Is.Equal().To("a"))
			this.expect(br.read(), Is.Equal().To("b"))
			this.expect(br.read(), Is.Equal().To("c"))
			this.expect(br.read(), Is.Equal().To("d"))
			this.expect(br.read(), Is.Equal().To("e"))
			this.expect(br.read(), Is.Equal().To("f"))
		})
		this.add("read three at a time", () => {
			var br = new BufferedReader(new StringReader("abcdef"))
			this.expect(br.read(3), Is.Equal().To("abc"))
			this.expect(br.read(3), Is.Equal().To("def"))
		})
		this.add("read three at a time with a newline", () => {
			var br = new BufferedReader(new StringReader("abc\ndef"))
			this.expect(br.read(3), Is.Equal().To("abc"))
			this.expect(br.read(1), Is.Equal().To("\n"))
			this.expect(br.read(3), Is.Equal().To("def"))
		})
		this.add("string location", () => {
			var br = new BufferedReader(new StringReader("abc\ndef"))
			this.expect(br.getLocation().column, Is.Equal().To(1))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(2))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(3))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(4))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(1))
			this.expect(br.getLocation().line, Is.Equal().To(2))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(2))
			this.expect(br.getLocation().line, Is.Equal().To(2))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(3))
			this.expect(br.getLocation().line, Is.Equal().To(2))
			br.read()
			this.expect(br.isEmpty())
		})
		this.add("tabs and newlines location", () => {
			var br = new BufferedReader(new StringReader("\t\t\t\n\t\t\t"))
			this.expect(br.getLocation().column, Is.Equal().To(1))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(2))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(3))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(4))
			this.expect(br.getLocation().line, Is.Equal().To(1))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(1))
			this.expect(br.getLocation().line, Is.Equal().To(2))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(2))
			this.expect(br.getLocation().line, Is.Equal().To(2))
			br.read()
			this.expect(br.getLocation().column, Is.Equal().To(3))
			this.expect(br.getLocation().line, Is.Equal().To(2))
			br.read()
			this.expect(br.isEmpty())
		})
		this.add("mark", () => {
			var br = new BufferedReader(new StringReader("abc\0"))
			this.expect(br.mark(), Is.Not().NullOrUndefined())
			br.read(); br.read(); br.read()
			var region = br.getRegion()
			this.expect(region.start.line, Is.Equal().To(1))
			this.expect(region.start.column, Is.Equal().To(1))
			this.expect(region.end.line, Is.Equal().To(1))
			this.expect(region.end.column, Is.Equal().To(4))
		})
	}
}
Fixture.add(new BufferedReaderTest())
