import React from 'react';
import Destination from './components/Destination';
import EmbedMap from "./components/EmbedMap";
import Login from "./components/Login";
import Trip from './components/Trip.jsx';
import { BrowserRouter, Switch, Route } from "react-router-dom";

const App = () => {
  return (
      <div className="ui container">
        <BrowserRouter>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Destination}></Route>
              <Route exact path="/trip" component={Trip}></Route>
              </Switch>
          </div>
        </BrowserRouter>
      </div>
  );
}

export default App;