const md = new Remarkable();

const Editor = React.createClass({
	getInitialState() {
		return {
			isEmptyField: true
		}
	},

	componentWillMount() {
		if (this.props.currentHeader.length && this.props.currentText.length) {
			this.setState({isEmptyField: false});
		} else {
			this.setState({isEmptyField: true})
		}
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.currentHeader.length && this.props.currentText.length) {
			this.setState({isEmptyField: false});
		} else {
			this.setState({isEmptyField: true})
		}
	},

	handleSavingArticle() {
		const newArticle = {
			id: Date.now(),
			header: this.refs.newArticleHeader.value,
			text: md.render(this.refs.newArticleText.value),
			category: this.refs.newArticleCategory.value
		};
		this.props.addNewArticle(newArticle);
		this.props.clearArticleInput();
	},

	render() {
		return(
			<div>
				<input
				 className='new-article-header'
				 placeholder='Type article header here...'
				 type='text'                  
				 ref='newArticleHeader'
				 value={this.props.currentHeader}
				 onChange={this.props.changeArticleHeader} />
				<br />

				<textarea 
					className='new-article-text'
					placeholder='Type article content here...'
					ref='newArticleText'
					value={this.props.currentText}
					onChange={this.props.changeArticleText}></textarea>
				<br />

				<label>Choose category:  
					<select ref='newArticleCategory'>
						<option value='politic'>Politic</option>
						<option value='finance'>Finance</option>
						<option value='sport'>Sport</option>
						<option value='other'>Other</option>
					</select>
				</label>

				<button 
					className='save-article-btn'
					disabled={this.state.isEmptyField}
					type='button'                 
					onClick={this.handleSavingArticle}>Save article</button>
			</div>
		)
	}
});

const LivePreview = React.createClass({
	render() {
		return(
			<div>
				<div className='preview-header'>{this.props.currentHeader}</div>
				<div className='preview-text' 
					dangerouslySetInnerHTML={{__html: md.render(this.props.currentText)}}></div>
			</div>
		)
	}
});

const ArticleCreator = React.createClass({
	getInitialState() {
		return {
			viewSwitcher: true,
			currentArticleHeader: '',
			currentArticleText: ''
		}
	},

	handleChangeArticleHeader(event) {
		this.setState({currentArticleHeader: event.target.value});  
	},

	handleChangeArticleText(event) {
		this.setState({currentArticleText: event.target.value});    
	},

	handleEditorSwitchView(event) {
		this.setState({viewSwitcher: !this.state.viewSwitcher});
	},

	handleClearArticleInput() {
		this.setState({currentArticleHeader: '', currentArticleText: ''});
	},

	render() {
		return(
			<div className='article-creator'>
				<h2>Create your own article</h2>

				<div className='editor-control'>
					<button
						className='editor-view'
						disabled={this.state.viewSwitcher}
						type='button'
						onClick={this.handleEditorSwitchView} >Editor View</button>
					<button
						className='live-preview'
						disabled={!this.state.viewSwitcher}
						type='button'
						onClick={this.handleEditorSwitchView} >Live Preview</button>
				</div>

				{
					this.state.viewSwitcher
					? <Editor
							addNewArticle={this.props.addNewArticle}
							currentHeader={this.state.currentArticleHeader}
							currentText={this.state.currentArticleText}
							changeArticleHeader={this.handleChangeArticleHeader}
							changeArticleText={this.handleChangeArticleText}
							clearArticleInput={this.handleClearArticleInput} />
					: <LivePreview
							currentHeader={this.state.currentArticleHeader}
							currentText={this.state.currentArticleText}    />
				}
							
			</div>
		)
	}
});

const ArticlesBox = React.createClass({
	getInitialState() {
		return {
			articles: this.props.articles,
			searchText: '',
			searchCategory: ''
		}
	},

	handleSearchArticle(event) {
		this.setState({searchText: event.target.value});
	},

	handleChooseCategory(event) {
		this.setState({searchCategory: event.target.value})
	},

	render() {
		let filteredArticles;
		if (this.state.searchCategory) {
			filteredArticles = 
				this.props.articles.filter(article => {
					if (article.header.toLowerCase().indexOf(this.state.searchText.toLowerCase()) != -1 
					&& article.category === this.state.searchCategory) {return article}})
					.map(article => 
						<Article
							id={article.id}                                  
							header={article.header}                     
							key={article.id}                                     
							text={article.text} 
							deleteArticle={this.props.deleteArticle.bind(null, article.id)} />
					)
		} else {
			filteredArticles = 
				this.props.articles.filter(article => 
					article.header.toLowerCase().indexOf(this.state.searchText.toLowerCase()) != -1)
					.map(article => 
						<Article    
							id={article.id}                              
							header={article.header}                         
							key={article.id}                                     
							text={article.text} 
							deleteArticle={this.props.deleteArticle.bind(null, article.id)} />
					)   
		}
		return(
			<div>
				<h2>Articles Box</h2>

				<label>
					Sort by category: 
					<select onChange={this.handleChooseCategory}>
						<option value=''></option>
						<option value='politic'>Politic</option>
						<option value='finance'>Finance</option>
						<option value='sport'>Sport</option>
						<option value='other'>Other</option>
					</select>
				</label>
				<br />

				<input 
					className='search-field'
					placeholder='search articles...' 
					type="text" 
					value={this.state.searchText}               
					onChange={this.handleSearchArticle} />

					<ul className='articles-list'>
					{
						filteredArticles    
					}                   
					</ul>
			</div>
		)
	}
});

const Article = React.createClass({
	getInitialState() {
		return {
			contentIsOpen: false
		}
	},

	handleOpeningContent() {
		this.setState({contentIsOpen: !this.state.contentIsOpen});
	},

	render() {
		const {
			id,
			header,
			text
		} = this.props;
		return(
			<div className='article'>
				<p className='article-header'>
					{header}
				</p>

				<div className='article-control'>
					<i 
							aria-hidden="true"
							className={this.state.contentIsOpen 
							? 'fa fa-angle-double-down green-arrow'
								: 'fa fa-angle-double-up'}                             
							onClick={this.handleOpeningContent}></i>
						<i 
							aria-hidden="true"
							className="delete-article-btn fa fa-times"                      
							onClick={this.props.deleteArticle}></i>
				</div>
				<p 
					className={this.state.contentIsOpen ? 'article-text' : 'hidden'}
					dangerouslySetInnerHTML={{__html: text}}>
				</p>
			</div>
		)
	}
});

const App = React.createClass({
	getInitialState() {
		return {
			articles: []
		}
	},

	componentDidMount() {
		const savedArticles = JSON.parse(localStorage.getItem('articles'));
		if (savedArticles) {
			this.setState({articles: savedArticles});
		} else {
			this.setState({articles: []});
		}   
	},

	handleAddArticle(newArticle) {
		const newArticlesList = this.state.articles.slice();
		newArticlesList.push(newArticle);
		this.setState({articles: newArticlesList});
		localStorage.setItem('articles', JSON.stringify(newArticlesList));      
	},

	handleDeleteArticle(articleId) {
		const newArticlesList = this.state.articles.filter(article => article.id != articleId);
		this.setState({articles: newArticlesList});
		localStorage.setItem('articles', JSON.stringify(newArticlesList));
	},

	render() {
		return(
			<div className='container'>
				<h1>New World Blog</h1>

				<ArticleCreator 
					addNewArticle={this.handleAddArticle} />

				<ArticlesBox articles={this.state.articles} 
					deleteArticle={this.handleDeleteArticle} />             
			</div>
		)
	}
});

ReactDOM.render(
	<App />,
	document.getElementById('root')
)