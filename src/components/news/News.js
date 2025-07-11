import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from '../Spinner';
import defaultImage from '../../assets/dumy.png'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import sampleData from '../../sampleData.json'; // Importing sample data

export class News extends Component {
  generateId = () => {
    let length = 10
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static defaultProps = {
    pageSize: 9,
    category: "general",
    country: "in"
  }

  static propTypes = {
    pageSize: PropTypes.number,
    category: PropTypes.string.isRequired,
    country: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      isOpen: false
    }
    document.title = `${this.capitalize(this.props.category)} - News Corner`;
  }

  async fetchData(url) {
    //try {
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log("api data");
      if (parsedData.status !== "error"){
        return parsedData;
      }
      return sampleData;
  }

  async componentDidMount() {
    this.props.setProgress(20);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.props.setProgress(40);
    this.setState({ loading: true });
    this.props.setProgress(50);
    let data = await this.fetchData(url);
    this.props.setProgress(90);
    this.setState({
      articles: data.articles,
      totalResults: data.totalResults,
      loading: false
    });
    this.props.setProgress(100);
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    let data = await this.fetchData(url);
    this.setState({
      articles: this.state.articles.concat(data.articles || []),
      totalResults: data.totalResults
    });
  };

  render() {
    const { search = '', onBookmark, isBookmarked, bookmarks, articles: propArticles, showOnlyBookmarks } = this.props;
    const searchLower = search.toLowerCase();
    // Use provided articles for bookmarks page, otherwise use state
    const baseArticles = showOnlyBookmarks ? (propArticles || []) : this.state.articles;
    const filteredArticles = baseArticles.filter(
      (ele) =>
        ele.title?.toLowerCase().includes(searchLower) ||
        ele.description?.toLowerCase().includes(searchLower)
    );
    return (
      <>
        <h1 className='text-center' style={{ marginTop: "80px" }}>
          {showOnlyBookmarks ? 'Bookmarked Articles' : `News corner - Top ${this.capitalize(this.props.category)} headlines`}
        </h1>
        {this.state.loading && !showOnlyBookmarks && <Spinner />}
        {filteredArticles.length === 0 && (
          <div className='text-center my-5'>No articles to display.</div>
        )}
        {!showOnlyBookmarks ? (
          <InfiniteScroll
            dataLength={filteredArticles.length}
            next={this.fetchMoreData}
            hasMore={filteredArticles.length !== this.state.totalResults}
            loader={<Spinner />}
          >
            <div className='container'>
              <div className='row'>
                {filteredArticles.map((ele) => (
                  <div className='col-md-4' key={ele.url + this.generateId()}>
                    <NewsItem
                      title={ele.title ? ele.title.slice(0, 45) : ""}
                      description={ele.description ? ele.description.slice(0, 88) : ""}
                      imageUrl={ele.urlToImage ? ele.urlToImage : defaultImage}
                      newsUrl={ele.url}
                      author={ele.author ? ele.author : "Unknown"}
                      date={ele.publishedAt}
                      source={ele.source.name}
                      onBookmark={onBookmark}
                      bookmarked={isBookmarked && isBookmarked(ele)}
                      article={ele}
                    />
                  </div>
                ))}
              </div>
            </div>
          </InfiniteScroll>
        ) : (
          <div className='container'>
            <div className='row'>
              {filteredArticles.map((ele) => (
                <div className='col-md-4' key={ele.url + this.generateId()}>
                  <NewsItem
                    title={ele.title ? ele.title.slice(0, 45) : ""}
                    description={ele.description ? ele.description.slice(0, 88) : ""}
                    imageUrl={ele.urlToImage ? ele.urlToImage : defaultImage}
                    newsUrl={ele.url}
                    author={ele.author ? ele.author : "Unknown"}
                    date={ele.publishedAt}
                    source={ele.source.name}
                    onBookmark={onBookmark}
                    bookmarked={isBookmarked && isBookmarked(ele)}
                    article={ele}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )
  }
}

export default News
