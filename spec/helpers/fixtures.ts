export function getValidResponse(fixture) {
	return [
		200,
		{ "Content-Type": "application/json" },
		JSON.stringify(fixture)
	];
}

export var Results = {
	valid: {
		status: 'OK',
		version: '1.0',
		response: {
			totalCount: 2,
			duration: 100,
			results: [
				{ title: 'Red wine' },
				{ title: 'White wine' }
			]
		}
	}
}