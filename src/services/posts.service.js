import axios from 'axios';

export const getPosts = (totalPages) => {
	return axios.get(`${process.env.REACT_APP_API_URL}&page=${totalPages}`);
};
