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

import { Fixture, Is } from "../Unit"
import { Locator } from "./Locator"

export class LocatorResolveTest extends Fixture {
	constructor() {
		super("Uri.Locator.resolve")
		this.add("resolve relative", () => {
			const absolute = Locator.parse("https://server.example.com/folder0/folder1/")
			const relative = Locator.parse("./folder2/file.extension")
			const locator = relative.resolve(absolute)
			this.expect(locator.scheme, Is.equal.to(["https"]))
			this.expect(locator.authority.user, Is.undefined)
			this.expect(locator.authority.endpoint.host, Is.equal.to(["server", "example", "com"]))
			this.expect(locator.authority.endpoint.port, Is.undefined)
			this.expect(locator.path, Is.equal.to(["folder0", "folder1", "folder2", "file.extension"]))
		})
	}
}
Fixture.add(new LocatorResolveTest())
