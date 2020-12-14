import * as assert from "assert"
import { DataTable } from "../dist/collections/containers"

// data-table tests
describe("page", () => {
	it(`should return the original rows if page (original) is called several time in a row`, () => {
		const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
		const filteredDT = startingDT
			.page({ size: 4, index: 0, options: { scope: "original" } })
			.page({ size: 10, index: 0, options: { scope: "original" } })
		assert.equal(filteredDT.length, 10)
	})
	it(`should discard original rows with the regular page function`, () => {
		const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
		const filteredDT = startingDT
			.page({ size: 4, index: 0 })
			.page({ size: 10, index: 0 })
		assert.equal(filteredDT.length, 4)
	})
})
describe("filter", () => {
	it(`should return the original rows after filtering if the original scope is required`, () => {
		const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
		const filteredDT = startingDT
			.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 4 } })
			.filter({ filter: { filters: [], combinator: "AND" }, options: { scope: "original" } })
		assert.equal(filteredDT.length, 10)
	})
	it(`should discard original rows with the regular filter function`, () => {
		const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
		const filteredDT = startingDT
			.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 4 } })
			.filter({ filter: { filters: [], combinator: "AND" } })
		assert.equal(filteredDT.length, 4)
	})
})
describe("Combinations of paging, sorting and filtering", () => {
	it(`should return 5 rows, when we filtered 2 out (discard) then paged 5 (no discard)`, () => {
		const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
		const filteredDT = startingDT.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 8 } })
		const pagedDT = filteredDT.page({ size: 5, index: 0, options: { scope: "original" } })
		assert.equal(pagedDT.length, 5)
	})
	it(`should return rows 10, 9, 8, 7, 6, 5 after sorting and paging`, () => {
		const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
		const sortedDT = startingDT.sort({ columnName: "v", order: "descending" })
		const pagedDT = sortedDT.page({ size: 5, index: 0 })
		assert.equal(JSON.stringify([...pagedDT.rowObjects].map(r => r.v)), JSON.stringify([10, 9, 8, 7, 6]))
	})
})