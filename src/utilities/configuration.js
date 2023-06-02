import React, { Component } from "react";
import API from "./../../../api/api";
var api;


class webAppConfiguration extends Component {
    constructor({ props }) {
        super(props);
        api = new API();
        this.state = {
            webConfiguration: []
        };
    }

    // getWebAppConfiguration = () => {
    //     api.get("GetAppConfiguration?webApp=true").then((response) => {
    //         if (response.StatusCode === 200 && response.Result) {
    //             this.state.webConfiguration({
    //                 webConfiguration: response.Result,
    //             });
    //         }
    //     });
    // };
}

export default webAppConfiguration;