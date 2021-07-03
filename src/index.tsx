import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './components/App';
import store from './store'
import 'semantic-ui-css/semantic.min.css'
import reportWebVitals from './reportWebVitals';
import Token from './components/Token';
import LandingPage from './components/LandingPage';
import TopLevelThing from './components/TopLevelThing';

ReactDOM.render(
  <Provider store={store}>
    <TopLevelThing>
      <App>
        <Token/>
      </App>
      {/* <LandingPage/> */}
    </TopLevelThing>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
