import React from "react";

import './Loader.css';

function Loader() {
    return (
        <div className="mapLoaderContainer">
            <div className="mapLoader">
                <img src="spinner.gif" />
                <h3>Loading...</h3>
            </div>
        </div>
    );
}

export default Loader;