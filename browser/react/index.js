import React from 'react';
import ReactDOM from 'react-dom';
import Main from './containers/Main';
import {BrowserRouter} from 'react-router-dom'
import {Route} from 'react-router'

ReactDOM.render(<BrowserRouter>
     <Route path="/" component={Main} />
  </BrowserRouter>, document.getElementById('app'));
