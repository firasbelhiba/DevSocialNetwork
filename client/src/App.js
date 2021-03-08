import './App.css';
import React, { Fragment } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './components/layout/Landing';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';




const App = () =>
  // In order to the router to work , we need to wrap it with <Router>
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </section>
    </Fragment>
  </Router>


export default App;
