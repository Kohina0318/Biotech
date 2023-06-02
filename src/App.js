import React from "react";
import { BrowserRouter } from "react-router-dom";
import Route from "routes/Route";
import "./scss/style.scss";
import "./scss/home-default.scss";
import "./scss/market-place-1.scss";
import "./scss/market-place-2.scss";
import "./scss/market-place-3.scss";
import "./scss/market-place-4.scss";
import "./scss/electronic.scss";
import "./scss/furniture.scss";
import "./scss/organic.scss";
import "./scss/technology.scss";
import "./scss/autopart.scss";
import "./scss/electronic.scss";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename={"/"}>
        <Route />
      </BrowserRouter>
    );
  }
}

export default App;
