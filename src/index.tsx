import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import Ancestor from './Ancestor';
import store from './store'
import 'semantic-ui-css/semantic.min.css'
import reportWebVitals from './reportWebVitals';
import TokenList from './TokenList';
import Token from './Token';

ReactDOM.render(
  <Provider store={store}>
    <Ancestor>
      <Token token={"ETH"}/>
    </Ancestor>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
