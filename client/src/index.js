import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import './index.scss';
import App from './component/App';
import stores from './mobx/store';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider {...stores}>
    <React.Fragment>
      <App />
      <DevTools />
    </React.Fragment>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
