import React from 'react';

import {Container, Row, Col } from 'react-bootstrap'

import ModelSelect from './ModelSelect'
import Doc from './Document'

import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        docs:[]
    }
    this.wordCloudClick = this.wordCloudClick.bind(this);
  }

  async wordCloudClick(resp) {
    console.log('Click happened', resp);
    const query_uri = '/documents/search-by-keywords'
    const options = {method:'POST',
        body:JSON.stringify({keywords:[resp.value],topics:[resp.topic],
        num_docs:10})}
    const docs = await fetch(query_uri, options).then(res => res.json())
    console.log('Keyword search ', docs)
    this.setState({docs:docs, topic:resp.topic, keywords:resp.value })
  }

  render() {
    let docs = 'Click a word in a word cloud to show associated documents'
    if (this.state.docs.length>0){
        docs = this.state.docs.map(d=>{
            const rating_data = {topic:this.state.topic, keywords:this.state.keywords}
            return (
                <Doc
                    endpoint={d.doc_id} score={d.score}
                    user={this.props.user}
                    event_type="wordClouds"
                    event_value={rating_data}
                />
                )
        })
    }
    return (
        <Container>
          <Row>
              <Col>
                    <ModelSelect
                        endpoint='/topics/get'
                        wordCloudClick={this.wordCloudClick}
                    />
              </Col>
              <Col>
                <Container>
                    {docs}
                </Container>
              </Col>
          </Row>
        </Container>
      );
  }
}

export default Home;
