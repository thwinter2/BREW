import React, { Component } from 'react';
import axios from 'axios';
import "./Preferences.css";

export default class Preferences extends Component {

  constructor() {
    super();
    this.state = {
      styles: [],
      addStyles: [],
      removeStyles: [],
      name: '',
      email: '',
      photo: '',
      preferences: {
        styles: [],
      },
      styleObjects: [],
    };

    this.handleStyleAdd = this.handleStyleAdd.bind(this);
    this.handleAddSubmit = this.handleAddSubmit.bind(this);
    this.handleRemoveSubmit = this.handleRemoveSubmit.bind(this);
  }

  componentDidMount() {
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
            styles: response.data ? response.data.preferences.styles : "",
          }
        })
      })
      .then(() => {
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

  handleStyleAdd(event) {
    const selected = [];
    let selectedOption = (event.target.selectedOptions);

    for (let i = 0; i < selectedOption.length; i++) {
      selected.push(selectedOption.item(i).value);
    }
    this.setState({ addStyles: selected });
  }

  handleStyleRemove(event) {
    const selected = [];
    let selectedOption = (event.target.selectedOptions);

    for (let i = 0; i < selectedOption.length; i++) {
      selected.push(selectedOption.item(i).value);
    }
    this.setState({ removeStyles: selected });
  }

  handleAddSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    let stylesSet = [...new Set([...this.state.preferences.styles, ...this.state.addStyles])];
    this.submit(stylesSet);
  }

  handleRemoveSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    var stylesSet = this.state.preferences.styles;
    for (let elm of this.state.removeStyles) {
      stylesSet = stylesSet.filter(e => e !== elm);
    }
    this.submit(stylesSet);
  }

  async submit(stylesSet) {
    const user = {
      name: this.state.name,
      email: this.state.email,
      photo: this.state.photo,
      preferences: {
        styles: stylesSet,
      }
    };
    console.log(user);
    let res = await axios.post('http://localhost:5000/users/update/' + this.state.id, user)
    console.log(res.data);

    // window.location = '/';
  }

  async styleClicked(id) {
    let styleContainerId = "beer_style_" + id;
    let styleContainerImgId = styleContainerId + "_image";

    let styleContainerDiv = document.getElementById(styleContainerId);
    let styleContainerDivImg = document.getElementById(styleContainerImgId);

    styleContainerDiv.classList.toggle('activeStyle');
    styleContainerDiv.classList.toggle('inactiveStyle');

    if (styleContainerDivImg.src.endsWith("/images/like.png")) {
      styleContainerDivImg.src = "/images/unlike.png";
    } else {
      styleContainerDivImg.src = "/images/like.png";
    }

    let isStyleActive = styleContainerDiv.classList.contains('activeStyle');

    let stylesSet = this.state.preferences.styles;
    if (isStyleActive) {
      stylesSet.push(id);
    }
    else {
      const index = stylesSet.indexOf(id);
      if (index > -1) {
        stylesSet.splice(index, 1);
      }
    }

    await this.submit(stylesSet, this.state.preferences.categories)
  }

  render() {
    // const hasPreferences = [...this.state.preferences.styles, ...this.state.preferences.categories];
    // const isLoggedIn = this.state.email;

    return (
      <div>
        <h3 className="preferencesTitle">What kind of beers do you like?</h3>
        <div className="preferencesContainer">
          {this.state.styles.map((style) => {
            let isStyleActive = this.state.preferences.styles.includes(style.id);
            return <div className={"styleContainer " + (isStyleActive ? "activeStyle" : "inactiveStyle")} onClick={() => { this.styleClicked(style.id) }} id={"beer_style_" + style.id}>
              <img id={"beer_style_" + style.id + "_image"} src={isStyleActive ? "/images/like.png" : "/images/unlike.png"} />
              <span>{style.style_name}</span>
            </div>
          }
          )}
        </div>
      </div>

      // <div class="preferencesContainer">
      //   {isLoggedIn
      //     ? <React.Fragment>
      //       <div className="preferencesTitle">
      //         {hasPreferences.length
      //           ? <React.Fragment>
      //             <h4>Your Current Beer Preferences</h4>
      //             <strong>Select and Submit to Remove</strong>
      //             <form onSubmit={this.handleRemoveSubmit}>
      //               <select multiple onChange={this.handleStyleRemove.bind(this)}>
      //                 {
      //                   this.state.styleObjects.map(style => (
      //                     <option value={style.id}>{style.style_name}</option>
      //                   ))
      //                 }
      //               </select>
      //               <div>
      //                 <input type="submit" value="Submit" className="btn btn-primary" />
      //               </div>
      //             </form>
      //           </React.Fragment>
      //           : null}
      //         <br></br>

      //       </div>
      //       <div className="preferencesTitle">
      //         <h4>Select Your Beer Preferences</h4>
      //         <strong>Select and Submit to Add</strong>
      //         <div>
      //           <form onSubmit={this.handleAddSubmit}>
      //             </select> */}
      //             <select multiple onChange={this.handleStyleAdd.bind(this)}>
      //               {
      //                 this.state.styles.map(style => (
      //                   <option value={style.id}>{style.style_name}</option>
      //                 ))
      //               }
      //             </select>
      //             <div>
      //               <input type="submit" value="Submit" className="btn btn-primary" />
      //             </div>
      //           </form>
      //         </div>
      //       </div>
      //     </React.Fragment>
      //     : null}
      // </div>
    );
  }
}