import React from 'react';

import { Accordion } from 'react-bootstrap'
import TopicCloud from './TopicCloud'

export default class ModelSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      response: [],
      items: []
    };
  }

  componentDidMount() {
    fetch(this.props.endpoint)
      .then(res => res.json())
      .then(
        (result) => {
        let topWords = result.map( x=>{ return x['topic_words'].slice(0,10)})
          this.setState({
            isLoaded: true,
            response: result,
            items: topWords
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
        // define list of wordclouds
        console.log('wordClouds', this.state.response)
        const wordClouds = this.state.response.map( (topic)=> {
            const index = topic['topic_num']
            const topicKey = `topic_${index}`
            const topWords = topic['topic_words'].slice(0,10).join(', ')
            const wordValues = topic.topic_words.map( (k,i)=> {
                return {value:k, count:topic.word_scores[i], topic: index} })
            //onClick={tag => alert(`'${tag.value}' was selected! in topic:${index}`)}
            return (
            <Accordion.Item eventKey={index} key={topicKey} >
                <Accordion.Header>Topic {index} - {topWords}</Accordion.Header>
                <Accordion.Body>
                      <TopicCloud
                            data={wordValues}
                            onClick={this.props.wordCloudClick }
                       />
                </Accordion.Body>
              </Accordion.Item>
                    )
        })
      return (
      <div>

        <Accordion defaultActiveKey="0">
               {wordClouds}
       </Accordion>

      </div>
      );
    }
  }
}