// The MIT License (MIT)
//
// Copyright (c) 2019 Simon Mika
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

async function close(fd: number): Promise<void> {}
async function fsync(fd: number): Promise<void> {}
async function open(path: string, flags: string | number, mode?: string | number | undefined | null): Promise<number> { return 0 }
async function write(fd: number, buffer: Buffer | string , offset: number | undefined | null, encoding: "utf8"): Promise<{ bytesWritten: number }> { return { bytesWritten: 0 } }

function lstatSync(path: string | number, options?: { encoding?: null; flag?: string; } | null): { isDirectory: () => boolean } { return { isDirectory: () => false } }
function readdirSync(path: string): string[] { return [] }
function readFileSync(path: string | number, encoding: "utf-8"): string { return "" }

export {
	close,
	fsync,
	open,
	write,
	lstatSync,
	readdirSync,
	readFileSync
}
