import React, { Component } from 'react';
import axios from 'axios';

export default class StylePreferences extends Component {
  // handleSubmit(e) {
  //   console.log(this.state);
  //   e.preventDefault();
    
    // const Preferences = {
    //   one_style: this.state.one_style,
    // }
    
    // console.log(Preferences);
    
    // axios.post('http://localhost:5000/users/update/' + this.props.match.params.id, exercise)
    //   .then(res => console.log(res.data));
    
    // window.location = '/';
  // }
  
  componentDidMount() {
  //   // axios.get('http://localhost:5000/styles/'+this.props.match.params.id)
    axios.get('http://localhost:5000/styles/')
      .then(response => {
        let styles_array = []
        for(let style of response.data){
          console.log(style);
          styles_array.push(style);
        }
        this.setState({
          styles: styles_array
        })   
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  constructor() {
      super();
      this.state = {
        styles: [
          {id: 1, cat_id: 1, style_name: 'style_1'},
          {id: 2, cat_id: 1, style_name: 'style_2'},
          {id: 3, cat_id: 1, style_name: 'style_3'},
          {id: 4, cat_id: 2, style_name: 'style_4'},
          {id: 5, cat_id: 2, style_name: 'style_5'},
          {id: 6, cat_id: 3, style_name: 'style_6'},
        ],
        selStyles: 'test_styles'
      };
       
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
     
  handleChange(event) {
    
    const selected=[];
    let selectedOption=(event.target.selectedOptions);
 
    for (let i = 0; i < selectedOption.length; i++){
      console.log(selectedOption.item(i));
      console.log(this.state.styles);
      selected.push(selectedOption.item(i).value);
    }
  
    this.setState({selStyles: selected});
  }
      
  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
  }
      
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <strong>Select Styles:</strong>
          <select multiple onChange={this.handleChange.bind(this)}>
           {
            this.state.styles.map(style => (
               <option value={style}>{style.style_name}</option>
             ))
          }
          </select>
          <div>
          <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}