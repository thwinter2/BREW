import React, { Component } from 'react';
import axios from 'axios';
import "./Preferences.css";

export default class Preferences extends Component {  
  
  constructor() {
    super();
    this.state = {
      categories: [],
      addCategories: [],
      removeCategories: [],
      styles: [],
      addStyles: [],
      removeStyles: [],
      name: '',
      email: '',
      photo: '',
      preferences: {
        styles: [],
        categories: [],
      },
      styleObjects: [],
      categoryObjects: [],
    };
    
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.handleStyleAdd = this.handleStyleAdd.bind(this);
    this.handleAddSubmit = this.handleAddSubmit.bind(this);
    this.handleRemoveSubmit = this.handleRemoveSubmit.bind(this);
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

    axios.get('/api/current_user/')
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
    .then(() => {
      axios.post('http://localhost:5000/categories/preferences', this.state.preferences.categories)
      .then(response => {
        this.setState({
          categoryObjects: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      })

      axios.post('http://localhost:5000/styles/preferences', this.state.preferences.styles)
      .then(response => {
        this.setState({
          styleObjects: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
    })
  }

  handleCategoryAdd(event) {
    const selected=[];
    let selectedOption=(event.target.selectedOptions);

    for (let i = 0; i < selectedOption.length; i++){
      selected.push(selectedOption.item(i).value);
    }
    this.setState({addCategories: selected});
  }

  handleCategoryRemove(event) {
    const selected=[];
    let selectedOption=(event.target.selectedOptions);

    for (let i = 0; i < selectedOption.length; i++){
      selected.push(selectedOption.item(i).value);
    }
    this.setState({removeCategories: selected});
  }

  handleStyleAdd(event) {
    const selected=[];
    let selectedOption=(event.target.selectedOptions);
 
    for (let i = 0; i < selectedOption.length; i++){
      selected.push(selectedOption.item(i).value);
    }
    this.setState({addStyles: selected});
  }

  handleStyleRemove(event) {
    const selected=[];
    let selectedOption=(event.target.selectedOptions);
 
    for (let i = 0; i < selectedOption.length; i++){
      selected.push(selectedOption.item(i).value);
    }
    this.setState({removeStyles: selected});
  }
      
  handleAddSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    let stylesSet = [...new Set([...this.state.preferences.styles, ...this.state.addStyles])];
    let categoriesSet = [...new Set([...this.state.preferences.categories, ...this.state.addCategories])];
    this.submit(stylesSet, categoriesSet);
  }

  handleRemoveSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    var stylesSet = this.state.preferences.styles;
    for (let elm of this.state.removeStyles){
      stylesSet = stylesSet.filter(e => e !== elm);
    }
    var categoriesSet = this.state.preferences.categories;
    for (let elm of this.state.removeCategories){
      categoriesSet = categoriesSet.filter(e => e !== elm);
    }
    this.submit(stylesSet, categoriesSet);
  }

  submit(stylesSet, categoriesSet) {
    const user = {
      name: this.state.name,
      email: this.state.email,
      photo: this.state.photo,
      preferences: {
        styles: stylesSet,
        categories: categoriesSet,
      }
    };
    console.log(user);
    axios.post('http://localhost:5000/users/update/' + this.state.id, user)
    .then(res => console.log(res.data));

    window.location = '/';
  }
      
  render() {
    const hasPreferences = [...this.state.preferences.styles, ...this.state.preferences.categories];
    const isLoggedIn = this.state.email;

    return (
      <div>
        { isLoggedIn
        ? <React.Fragment>
        <div className="preferencesTitle">
          { hasPreferences.length
          ? <React.Fragment>
          <h4>Your Current Beer Preferences</h4>
          <strong>Select and Submit to Remove</strong>
          <form onSubmit={this.handleRemoveSubmit}>
            <select multiple onChange={this.handleCategoryRemove.bind(this)}>
            {
              this.state.categoryObjects.map(category => (
                <option value={category.id}>{category.cat_name}</option>
                ))
              }
            </select>
            <select multiple onChange={this.handleStyleRemove.bind(this)}>
            {
              this.state.styleObjects.map(style => (
                <option value={style.id}>{style.style_name}</option>
                ))
              }
            </select>
            <div>
            <input type="submit" value="Submit" className="btn btn-primary"/>
            </div>
          </form>
          </React.Fragment>
          : null}
          <br></br>
          <div className="preferencesTitle">
            <h4>Select Your Beer Preferences</h4>
            <strong>Select and Submit to Add</strong>
            <div>
              <form onSubmit={this.handleAddSubmit}>
                <select multiple onChange={this.handleCategoryAdd.bind(this)}>
                {
                  this.state.categories.map(category => (
                    <option value={category.id}>{category.cat_name}</option>
                    ))
                  }
                </select>
                <select multiple onChange={this.handleStyleAdd.bind(this)}>
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
        </div>
        </React.Fragment>
        : null}
      </div>
    );
  }
}