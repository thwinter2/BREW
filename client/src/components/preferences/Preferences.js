import React, { Component } from 'react';
import axios from 'axios';

export default class Preferences extends Component {
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
      

    axios.get('http://localhost:5000/categories/')
    .then(response => {
      let categories_array = [];
      // console.log(response.data);
      for(let category of response.data){
        categories_array.push(category);
      }
      this.setState({
        categories: categories_array
      })   
    })
    .catch((error) => {
      console.log(error);
    })
  }

  constructor() {
      super();
      this.state = {
        categories: [
          {id: 1, cat_name: 'beer1'},
          {id: 2, cat_name: 'beer2'},
          {id: 3, cat_name: 'beer3'}
        ],
        selCategories: 'test_cats',
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
      console.log(this.state.categories);
      console.log(this.state.styles);
      selected.push(selectedOption.item(i).value);
    }
  
    this.setState({selCategories: selected});
  }
      
  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
  }
      
  render() {
    return (
      <div>
        <h3>Select Your Beer Preferences</h3>
        <form onSubmit={this.handleSubmit}>
            
          <strong>Select Category:</strong>
          <select multiple onChange={this.handleChange.bind(this)}>
           {
            this.state.categories.map(category => (
               <option value={category.id}>{category.cat_name}</option>
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