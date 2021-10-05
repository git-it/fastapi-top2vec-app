import React from 'react';

import { TagCloud } from 'react-tagcloud'

/*
on load query "/topics/get"
    - create wordcloud for each topic
        - TODO
            make wordcloud component with
                onclick handler (For word) to query '/documents/search-by-keywords'
                    with topic set... and return list of docs (more XHR)

*/


export default class TopicCloud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      items: []
    };
  }

  render() {
//        const colors = {luminosity: 'dark',
//                  hue: 'green',
//                }
      return (
      <div>
       <TagCloud
            shuffle={true}
            minSize={12}
            maxSize={45}
            tags={this.props.data}
            onClick={this.props.onClick}
          />
      </div>
      );
    }
//  }
}