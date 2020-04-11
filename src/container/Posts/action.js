import { GET_POSTS, GET_SEARCH_RESULTS, PAGE_CHANGE } from './actionTypes';
import { getPosts } from '../../services/posts.service';

export const getPostAction = (totalPages) => {
	return (dispatch) => {
		getPosts(totalPages)
			.then((response) => {
				if (response && response.status && response.status === 200) {
					dispatch({
						type: GET_POSTS,
						payload: response.data,
					});
				}
			})
			.catch((error) => {
				alert(
					'Error: Something went wrong in fetching POST API. Please try again later'
				);
			});
	};
};

export const getSearchResultsAction = (searchKey) => {
	return (dispatch) => {
		dispatch({
			type: GET_SEARCH_RESULTS,
			payload: searchKey,
		});
	};
};

export const getPageChangeAction = (selectedPageNo) => {
	return (dispatch) => {
		dispatch({
			type: PAGE_CHANGE,
			payload: selectedPageNo,
		});
	};
};
