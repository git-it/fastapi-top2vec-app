import React from 'react'
import { Icon } from 'semantic-ui-react'


class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        voted: false
    }
    this.voteUp = this.voteUp.bind(this);
    this.voteDown = this.voteDown.bind(this);
  }

  voteUp(event){
    if (this.state.voted){ return }
    event.target.className = "thumbs up icon"
    let params = this.props.voteData;
    params['rating'] = 1
    params['dtoi'] = new Date()
    params['user'] = 'none'
    //params['event_type'] = 'thumb click'
    const options = {method: 'POST',
        body:JSON.stringify(params) }
    fetch(this.props.voteURI, options).then( x =>{
        console.log('voteUp ', x)
    })
    this.setState({voted:true})
  }

  voteDown(event){
    if (this.state.voted){ return }
    console.log('down click event', event)
    event.target.className = "thumbs down icon"
    let params = this.props.voteData;
    params['rating'] = -1
    params['dtoi'] = new Date()
    params['user'] = 'none'
    //params['event_type'] = 'thumb click'
    console.log('PARAMS', params)
    const options = {method: 'POST',
        body:JSON.stringify(params) }
    fetch(this.props.voteURI, options).then( x =>{
        console.log('VOTEDOWN ', x)
    })
    this.setState({voted:true})
  }

  render() {
   return (
            <div>
            <Icon name='thumbs down outline' link onClick={this.voteDown}/>
            <Icon name='thumbs up outline' link onClick={this.voteUp}/>
            </div>
    )
   }
}
export default Rating