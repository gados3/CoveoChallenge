import { AppView } from '../src/views/app';
import { PaginationView } from '../src/views/pagination';
import { SeachView } from '../src/views/search';

describe('PaginationView', () => {
	let App: AppView;
	let Search: SeachView;
	let Pagination: PaginationView;

	beforeEach(() => {
		App = new AppView();
		Search = new SeachView(App);
		Pagination = new PaginationView(Search);
	});

	it('should start at page 0', () => {
		expect(Pagination.currentPage).toBe(0);
	});

	describe('when rendering', () => {
		beforeEach(() => {
			Pagination.render(10);
		})
	});

	// describe('when user goes to next page', () => {

	// });

});
