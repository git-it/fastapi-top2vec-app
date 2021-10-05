import React from 'react';

import { Accordion } from 'react-bootstrap'
import {Container, Row, Form, Button } from 'react-bootstrap'

import TopicCloud from './TopicCloud'

import 'bootstrap/dist/css/bootstrap.min.css';

class TSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        docs:[],
        response:[]
    }
    this.Query = this.Query.bind(this);
  }

  async Query(event) {
    const term = document.getElementById('query_text_topic').value
    console.log('Click happened', term );
    const num_topics = await fetch('/topics/number')
                            .then(res => res.json())
                            .then(res => res['num_topics'])
    const query_uri = '/topics/search'
    const options = {method:'POST',
    body:JSON.stringify({keywords:term.split(' '),
        num_topics:num_topics})}
    const docs = await fetch(query_uri, options).then(res => res.json())
    console.log('topic search ', docs)
    let error_msg = ''
    if (docs.hasOwnProperty('message')) error_msg=docs.message
    this.setState({response:docs, error_msg:error_msg})
  }

  render() {
    const wordClouds = this.state.response.map( (topic)=> {
        const index = topic['topic_num']
        const acc_key = `topic_${index}`
        const topWords = topic['topic_words'].slice(0,10).join(', ')
        const wordValues = topic.topic_words.map( (k,i)=> {
            return {value:k, count:topic.word_scores[i], topic: index} })
        return (
        <Accordion.Item eventKey={index} key={acc_key}>
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
        <Container>

<Form.Group noValidate  as={Row} className="mb-3"
    controlId="query_text_topic">
    <Form.Label>Search:</Form.Label>
    <Form.Control type="text" placeholder="Search for topics"/>
  </Form.Group>
   <Button variant="primary"onClick={this.Query}>
    Query
  </Button>

          <Row>
            <Container>
                {this.state.error_msg}

                <Accordion defaultActiveKey="0">
                       {wordClouds}
               </Accordion>
            </Container>

          </Row>
        </Container>
      );
  }
}

export default TSearch;
