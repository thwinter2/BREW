import React, { Component } from 'react';
import axios from 'axios';

export default class Preferences extends Component {  
  
  constructor() {
    super();
    this.state = {
      categories: [],
      selCategories: [],
      styles: [],
      selStyles: [],
      name: '',
      email: '',
      photo: '',
      preferences: {
        styles: [],
        categories: [],
      }
    };
    
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleStyleChange = this.handleStyleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    axios.get('http://localhost:5000/categories/')
    .then(response => {
      this.setState({
        categories: response.data
      });
    })
    .catch((error) => {
      console.log(error);
    })

    axios.get('http://localhost:5000/styles/')
    .then(response => {
      this.setState({
        styles: response.data
      });
    })
    .catch((error) => {
      console.log(error);
    })

    axios.get('http://localhost:5000/users/61004b28d917d6dd3317f2d3')
    .then(response => {
      this.setState({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        photo: response.data.photo,
        preferences: {
          styles: response.data.preferences.styles,
          categories: response.data.preferences.categories,
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  handleCategoryChange(event) {
    
    const selected=[];
    let selectedOption=(event.target.selectedOptions);
 
    for (let i = 0; i < selectedOption.length; i++){
      console.log(selectedOption.item(i));
      selected.push(selectedOption.item(i).value);
    }
    
    this.setState({selCategories: selected});
    console.log(this.state);
  }

  handleStyleChange(event) {
    
    const selected=[];
    let selectedOption=(event.target.selectedOptions);
 
    for (let i = 0; i < selectedOption.length; i++){
      console.log(selectedOption.item(i));
      selected.push(selectedOption.item(i).value);
    }
    
    this.setState({selStyles: selected});
    console.log(this.state);
  }
      
  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    let catSet = [...new Set([...this.state.categories, ...this.state.selCategories])];
    const user = {
      name: this.state.name,
      email: this.state.email,
      photo: this.state.photo,
      preferences: {
        styles: this.state.selStyles,
        categories: this.state.selCategories,
        // categories: catSet,
      }
    };
    console.log(user);
    axios.post('http://localhost:5000/users/update/61004b28d917d6dd3317f2d3', user)
    .then(res => console.log(res.data));

    window.location = '/';
  }
      
  render() {
    return (
      <div>
        <h3 className="bg-dark text-white mt-5 p-4 text-center">
          Select Your Beer Preferences</h3>
        <form onSubmit={this.handleSubmit}>
          <select multiple onChange={this.handleCategoryChange.bind(this)}>
           {
            this.state.categories.map(category => (
               <option value={category}>{category.cat_name}</option>
             ))
          }
          </select>
          <select multiple onChange={this.handleStyleChange.bind(this)}>
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