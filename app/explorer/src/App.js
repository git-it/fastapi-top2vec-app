import React from 'react';

import {  Navbar } from 'react-bootstrap'
import {Container, Row, Tab, Tabs } from 'react-bootstrap'

import Home from './components/Home'
import KSearch from './components/KeywordSearch'
import TSearch from './components/TopicSearch'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css'

function App() {
  return (

    <Container className="p-3">
    <Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="#home">Top2Vec</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">

    </Navbar.Collapse>
  </Container>
</Navbar>
    <Container fluid>
      <Row>
        <h3 className="header">Welcome To ___??___ </h3>
      </Row>

        <Tabs
              id="tab-example"
              defaultActiveKey="clouds"
              className="mb-3"
            >
        <Tab eventKey="clouds" title="Topic Word Clouds">
            <Home />
        </Tab>
        <Tab eventKey="keywordSearch" title="Documents by Keywords">
           <KSearch />
        </Tab>
        <Tab eventKey="semanticSearchTopics" title="Topics by keywords">
            <TSearch />
        </Tab>
        </Tabs>

    </Container>


  </Container>
  );
}

export default App;
