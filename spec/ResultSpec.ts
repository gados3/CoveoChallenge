import * as sinon from 'sinon';
import { ResultCollection } from '../src/collections/result';
import * as fixtures from './helpers/fixtures';
import { getValidResponse } from './helpers/fixtures';

describe('ResultCollection', () => {

	let baseUrl = 'https://cloudplatform.coveo.com/rest/search';
	let server: sinon.SinonFakeServer;
	let Results: ResultCollection;

	describe('when a search query is made', () => {

		beforeEach(() => {
			server = sinon.fakeServer.create();
			server.respondWith(
				'POST',
				baseUrl,
				fixtures.getValidResponse(fixtures.Results.valid)
			);
			Results = new ResultCollection();
		});

		it('should build the correct request', () => {
			Results.fetch();
			expect(server.requests.length).toEqual(1);
			expect(server.requests[0].method).toEqual('POST');
			expect(server.requests[0].url).toEqual(baseUrl);
			expect(server.requests[0].requestHeaders['Authorization']).toBeDefined;
		});

		it('should make the correct query', () => {
			Results.fetch({
				fieldsToExclude: ['field1', 'field2'],
				firstResult: 0,
				numberOfResults: 10,
				q: 'query'
			});
			expect(server.requests[0].requestBody).toEqual(JSON.stringify({
				fieldsToExclude: ['field1', 'field2'],
				firstResult: 0,
				numberOfResults: 10,
				q: 'query'
			}));
		});

		it('should parse results from the response', () => {
			Results.fetch();
			server.respond();
			expect(Results.length).toEqual(fixtures.Results.valid.response.results.length);
			expect(Results.get(1).get('title')).toEqual(fixtures.Results.valid.response.results[0].title);
		});

		afterEach(() => {
			server.restore();
		});

	});

});
