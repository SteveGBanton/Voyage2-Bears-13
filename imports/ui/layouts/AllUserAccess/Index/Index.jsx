import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';


import './Index.scss';

const tempFeaturedArr = [
  {
    skill: 'JavaScript',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/js.png',
    link: '/learning-paths?title=javascript',
  },
  {
    skill: 'React',
    description: 'Here is a short description of said skill',
    link: '/learning-paths?title=react',
  },
  {
    skill: 'CSS',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/css3.png',
    link: '/learning-paths?title=css',
  },
  {
    skill: 'Node',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/node.png',
    link: '/learning-paths?title=node',
  },
  {
    skill: 'HTML5',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/html5.png',
    link: '/learning-paths?title=HTML5',
  },
  {
    skill: 'Algebra',
    description: 'Here is a short description of said skill',
    link: '/learning-paths?title=algrebra',
  },
];

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchFocused: false,
      featured: [],
      searchInput: '',
    };
  }

  toggleSearchFocus(toggle) {
    if (toggle) {
      this.setState({ searchFocused: toggle });
    } else {
      this.setState({ searchFocused: toggle, searchInput: '' });
    }
  }

  handleChangeSearchInput(e) {
    this.setState({ searchInput: e.target.value });
  }

  render() {
    const featured = tempFeaturedArr.map(x =>
      (
        <Card className="Inedx-featuredCard" key={x.skill}>
          <Link to={x.link}>
            <div
              className="Index-featuredCardImg"
              style={{ backgroundImage: `url(${x.img ? x.img : 'books.jpg'})`
              }}
              alt={x.skill}
            />
            <CardTitle
              style={{ textDecoration: 'none' }}
              className="Index-cardTitle"
              title={x.skill}
              subtitle={x.description}
            />
          </Link>
        </Card>
    ),
    );

    const { history } = this.props;

    return (
      <div className="Index">
        <div
          className="Index-header"
          // style={{backgroundImage: `url('library.jpeg')`}}
        >
          <div>
            <h1>Learn Something Awesome</h1>
          </div>

          <div className="Index-search">
            <h3>Search Learning Paths <FontIcon
              className="fa fa-search"
              onClick={() => {
                history.push('/learning-paths');
              }}
              style={{ fontSize: 30, color: '#FFFFF', cursor: 'pointer' }}
            />
              &nbsp;or Browse Categories:
            </h3>

            {/* <div
              className={
                this.state.searchFocused ? "Index-searchInputWrap on" : "Index-searchInputWrap off"
              }
            > */}
              {/* <input
                onFocus={() => this.toggleSearchFocus(true)}
                onBlur={() => this.toggleSearchFocus(false)}
                onChange={this.handleChangeSearchInput}
                value={this.state.searchInput}
                type="text"
                placeholder="⌕"
                className="Index-searchInput"
              /> */}
            {/* </div> */}
          </div>
        </div>
        <div className="Index-featured">
          {/* <h2 className="Index-featuredTitle">Featured</h2> */}
          <div className="Index-featuredCardWrap">{featured}</div>
        </div>
      </div>
    );
  }
}

export default Index;
