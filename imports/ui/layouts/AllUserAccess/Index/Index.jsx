import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import './Index.scss';

const tempFeaturedArr = [
  {
    skill: 'JavaScript',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/js.png',
  },
  {
    skill: 'React',
    description: 'Here is a short description of said skill',
  },
  {
    skill: 'CSS',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/css3.png',
  },
  {
    skill: 'Node',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/node.png',
  },
  {
    skill: 'HTML',
    description: 'Here is a short description of said skill',
    img: '/tempAssets/logos/html5.png',
  },
  {
    skill: 'Algebra',
    description: 'Here is a short description of said skill',
  },
  {
    skill: 'Stuff',
    description: 'Here is a short description of said skill',
  },
  {
    skill: 'More Stuff',
    description: 'Here is a short description of said skill',
  },
  {
    skill: 'All The Things',
    description: 'Here is a short description of said skill',
  },
];

class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchFocused: false,
      featured: [],
      searchInput: '',
    }
  }

  toggleSearchFocus = (toggle) => {
    if (toggle) {
<<<<<<< Updated upstream
      this.setState({searchFocused: toggle});
    } else {
      this.setState({searchFocused: toggle, searchInput: ''});
=======
      this.setState({searchFocused: toggle})
    } else {
      this.setState({searchFocused: toggle, searchInput: ''})
>>>>>>> Stashed changes
    }
  }

  handleChange_searchInput = (e) => {
    this.setState({searchInput: e.target.value});
  }

  render() {
    const featured = tempFeaturedArr.map((x, i) =>
      <Card className="Inedx-featuredCard" key={i}>
        {/* <CardMedia> */}
          <div className="Index-featuredCardImg" style={{backgroundImage: `url(${x.img ? x.img : 'books.jpg'})`}} alt={x.skill} />
        {/* </CardMedia> */}
        <CardTitle title={x.skill} subtitle={x.description} />
    </Card>
    );

    return (
      <div className="Index">
        <div
          className="Index-header"
          // style={{backgroundImage: `url('library.jpeg')`}}
        >
          <div>
            <h2>Learn Something Awesome</h2>
            {/* <p>Gain skills trought curated learning paths</p> */}
          </div>

          <div className="Index-search">
            <h3>Search</h3>
            <div
              className={
                this.state.searchFocused ? "Index-searchInputWrap on" : "Index-searchInputWrap off"
              }
            >
              <input
                onFocus={() => this.toggleSearchFocus(true)}
                onBlur={() => this.toggleSearchFocus(false)}
                onChange={this.handleChange_searchInput}
                value={this.state.searchInput}
                type="text"
                placeholder="⌕"
                className="Index-searchInput"
              />
          </div>
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
