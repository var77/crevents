import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Provider } from 'react-redux';
import App from './app/app';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GoogleReCaptchaProvider reCaptchaKey="6LeBYC8lAAAAAL_QfzDwyKTVxXm9kwGlnQu3bZ37">
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </GoogleReCaptchaProvider>
);
