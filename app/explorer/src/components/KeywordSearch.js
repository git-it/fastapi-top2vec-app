import React from 'react';

import {Container, Row, Form, Button } from 'react-bootstrap'
import Doc from './Document'

import 'bootstrap/dist/css/bootstrap.min.css';

class KSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        docs:[],
        query_term:''
    }
    this.Query = this.Query.bind(this);
  }

  async Query(event) {
    const term = document.getElementById('query_text').value
    console.log('Click happened', term );
    const query_uri = '/documents/search-by-keywords'
    const options = {method:'POST',
    body:JSON.stringify({keywords:[term],
        num_docs:50})}
    const docs = await fetch(query_uri, options).then(res => res.json())
    console.log('Keyword search ', docs)
    let error_msg = ''
    if (docs.hasOwnProperty('message')) error_msg=docs.message
    this.setState({docs:docs, error_msg:error_msg, query_term: term})
  }

  render() {
    let docs = ''
    if (this.state.docs.length>0){
        docs = this.state.docs.map(d=>{
            return (
            <Doc
                key={d.doc_id}
                endpoint={d.doc_id}
                score={d.score}
                user={this.props.user}
                event_type="keywordSearch"
                event_value={this.state.query_term}
            />
            )
        })
    }
    return (
        <Container>

<Form.Group noValidate  as={Row} className="mb-3"
    controlId="query_text">
    <Form.Label>Search:</Form.Label>
    <Form.Control type="text" placeholder="Keyword search"/>
  </Form.Group>
   <Button variant="primary"onClick={this.Query}>
    Query
  </Button>

          <Row>
            <Container>
                {this.state.error_msg}
                {docs}
            </Container>
          </Row>
        </Container>
      );
  }
}

export default KSearch;
