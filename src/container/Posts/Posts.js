import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form } from 'react-bootstrap';
import {
	getPostAction,
	getSearchResultsAction,
	getPageChangeAction,
} from './action';
import PostDetailsModal from '../../components/PostDetailsModal';
import Pagination from '../../components/Pagination';

class Posts extends Component {
	intervalId;
	constructor(props) {
		super(props);
		this.state = {
			selectedPost: null,
		};
	}

	getPost = () => {
		this.props.getPostAction(this.props.totalPages);
	};

	componentDidMount = () => {
		this.getPost();
		this.intervalId = setInterval(() => {
			this.getPost();
		}, 10000);
	};

	componentWillUnmount = () => {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	};

	onSelectPost = (selectedPost) => {
		this.setState({
			...this.state,
			selectedPost,
		});
	};

	onModalClose = () => {
		this.setState({
			...this.state,
			selectedPost: null,
		});
	};

	onChange = (event) => {
		let searchKey = event.target.value;
		this.props.getSearchResultsAction(searchKey);
	};

	onPageChange = (event) => {
		const target = event.target;
		if (target && target.tagName.toLowerCase() === 'a') {
			const selectedPage = parseInt(target.text.trim());
			this.props.getPageChangeAction(selectedPage);
		}
	};

	render() {
		return (
			<div className="container p-5">
				<Form>
					<Form.Group controlId="searchTerm">
						<Form.Control
							type="text"
							placeholder="Search by title, URL or author..."
							onChange={(event) => this.onChange(event)}
							value={this.props.searchTerm}
						/>
					</Form.Group>
				</Form>

				<Table>
					<thead>
						<tr>
							<th>Title</th>
							<th>URL</th>
							<th>Created At</th>
							<th>Author</th>
						</tr>
					</thead>
					<tbody>
						{this.props.currentPosts.map((post, index) => (
							<tr key={index} onClick={() => this.onSelectPost(post)}>
								<td className="ctd">{post.title}</td>
								<td className="ctd">
									<a
										target="_blank"
										rel="noopener noreferer"
										href={post.url}
										onClick={(e) => e.stopPropagation()}
										title={post.url}
									>
										{post.url}
									</a>
								</td>
								<td className="ctd">{post.created_at}</td>
								<td className="ctd">{post.author}</td>
							</tr>
						))}
					</tbody>
				</Table>
				{this.props.currentActivePage ? (
					<Pagination
						currentActivePage={this.props.currentActivePage}
						totalPages={this.props.totalPages}
						onPageChange={this.onPageChange}
					/>
				) : null}
				{this.state.selectedPost ? (
					<PostDetailsModal
						selectedPost={this.state.selectedPost}
						onModalClose={this.onModalClose}
					/>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		posts,
		currentPosts,
		pageNo,
		totalPages,
		currentActivePage,
		selectedPage,
		selectedPost,
		searchTerm,
		filteredPost,
	} = state;

	return {
		posts,
		currentPosts,
		pageNo,
		totalPages,
		currentActivePage,
		selectedPage,
		selectedPost,
		searchTerm,
		filteredPost,
	};
};

const mapDispatchToProps = {
	getPostAction,
	getSearchResultsAction,
	getPageChangeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
