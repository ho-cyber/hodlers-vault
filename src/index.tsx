import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './components/App';
import store from './store'
import 'semantic-ui-css/semantic.min.css'
import reportWebVitals from './reportWebVitals';
import Token from './components/Token';
import LandingPage from './components/LandingPage';
import TopLevelThing from './components/TopLevelThing';
import { HowItWorks } from './components/HowItWorks';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <TopLevelThing>
        <Switch>
          <Route path="/tokens"><App><Token/></App></Route>
          <Route exact path="/howitworks"><HowItWorks/></Route>
          <Route path="/"><LandingPage/></Route>
        </Switch>
      </TopLevelThing>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
