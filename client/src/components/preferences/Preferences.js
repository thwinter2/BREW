import React, { Component } from 'react';
import axios from 'axios';
import "./Preferences.css";

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

    axios.get('/api/current_user')
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
      selected.push(selectedOption.item(i).value);
    }
    
    this.setState({selCategories: selected});
  }

  handleStyleChange(event) {
    
    const selected=[];
    let selectedOption=(event.target.selectedOptions);
 
    for (let i = 0; i < selectedOption.length; i++){
      selected.push(selectedOption.item(i).value);
    }
    
    this.setState({selStyles: selected});
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
    axios.post('http://localhost:5000/users/update/' + this.state.id, user)
    .then(res => console.log(res.data));

    window.location = '/';
  }
      
  render() {
    return (
      <div className="preferencesTitle">
        <h4>Select Your Beer Preferences</h4>
        <div>
          <form onSubmit={this.handleSubmit}>
            <select multiple onChange={this.handleCategoryChange.bind(this)}>
            {
              this.state.categories.map(category => (
                <option value={category.id}>{category.cat_name}</option>
                ))
                }
            </select>
            <select multiple onChange={this.handleStyleChange.bind(this)}>
            {
              this.state.styles.map(style => (
                <option value={style.id}>{style.style_name}</option>
                ))
                }
            </select>
            <div>
            <input type="submit" value="Submit" className="btn btn-primary"/>
            </div>
          </form>
        </div>
      </div>
    );
  }
}