import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/App/App.jsx';

import '../../ui/stylesheets/app.scss';

Bert.defaults = {
  hideDelay: 3500,
  style: 'growl-bottom-right',
  type: 'default'
};

Meteor.startup(() => render(<App />, document.getElementById('react-root')));
