import React from 'react';

import { Col, Card, Row } from 'react-bootstrap'
import Rating from './ThumbRater'

export default class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      response: [],
      text: []
    };
  }

  componentDidMount() {
    //res.json()
    fetch(this.props.endpoint)
      .then(res => res.text())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            response: result,
            text: result
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
        let percentScore = '';
        if (this.props.score!==undefined) {
            percentScore=<p>score: {this.props.score}</p>
        }
        const ratingParams = {doc_id: this.props.endpoint,
                                user: this.props.user,
                                event_type: this.props.event_type,
                                event_value: JSON.stringify(this.props.event_value) }
        return (
            <Card>

                <Card.Body>
                <Row>
                <Col>
                    {percentScore}
                </Col>
                <Col className="col-md-3 offset-3">
                    <Rating
                        voteData={ratingParams}
                        voteURI="/rating"
                        />
                </Col>
                </Row>

                <Card.Text>
                    {this.state.text}
                </Card.Text>
                <Card.Link href={this.props.endpoint}>{this.props.endpoint}</Card.Link>
                </Card.Body>
            </Card>
        )
    }
  }
  }