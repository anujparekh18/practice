import { GET_POSTS, GET_SEARCH_RESULTS, PAGE_CHANGE } from './actionTypes';

const INITIAL_STATE = {
	posts: [],
	currentPosts: [],
	searchTermPosts: [],
	pageNo: 0,
	totalPages: 0,
	currentActivePage: 1,
	selectedPage: -1,
	searchTerm: '',
	filteredPost: [],
};

const rootReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_POSTS:
			let posts = [...state.posts, ...action.payload.hits];
			let totalPages = state.totalPages + 1;
			let selectedPage = state.selectedPage;
			let currentPosts = [];
			let currentActivePage = 1;
			if (selectedPage > -1) {
				currentActivePage = selectedPage;
			}
			if (!state.currentPosts.length) {
				currentPosts = action.payload.hits;
			} else {
				currentPosts = state.currentPosts;
			}
			return {
				...state,
				posts: posts,
				pageNo: action.payload.page,
				totalPages: totalPages,
				selectedPage: selectedPage,
				currentPosts: currentPosts,
				searchTermPosts: currentPosts,
				currentActivePage: currentActivePage,
			};

		case GET_SEARCH_RESULTS: {
			const searchTerm = action.payload.toLowerCase().trim();
			let filteredPost = [];
			if (
				state.currentPosts &&
				state.currentPosts.length &&
				searchTerm.length
			) {
				filteredPost = state.searchTermPosts.filter((post) => {
					const title = post.title.toLowerCase();
					const url = post.url ? post.url.toLowerCase() : '';
					const author = post.author.toLowerCase();
					return (
						title.includes(searchTerm) ||
						url.includes(searchTerm) ||
						author.includes(searchTerm)
					);
				});
			}
			if (!searchTerm.length) {
				const selectedPage = state.selectedPage;
				const startIndex =
					selectedPage > -1
						? (selectedPage - 1) * 20
						: (state.currentActivePage - 1) * 20;
				const endIndex = startIndex + 20;
				filteredPost = state.posts.slice(startIndex, endIndex);
			}
			return {
				...state,
				searchTerm: action.payload,
				currentPosts: filteredPost,
			};
		}

		case PAGE_CHANGE: {
			const selectedPage = action.payload;
			const startIndex =
				selectedPage > -1
					? (selectedPage - 1) * 20
					: (state.currentActivePage - 1) * 20;
			const endIndex = startIndex + 20;
			let posts = state.posts.slice(startIndex, endIndex);
			return {
				...state,
				selectedPage: action.payload,
				currentActivePage: action.payload,
				currentPosts: posts,
				searchTermPosts: posts,
				searchTerm: '',
			};
		}

		default:
			return state;
	}
};

export default rootReducer;
