import React from 'react';
// import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
// import validate from '../../../modules/validate';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import OAuthLoginButtons from '../../../components/OAuthLoginButtons/OAuthLoginButtons.jsx';
import customFormValidator from '../../../../modules/custom-form-validator';

const rules = {
  emailAddress: {
    required: true,
    email: true,
  },
  password: {
    required: true,
  },
};

const messages = {
  emailAddress: {
    required: 'Please enter your email address.',
    email: 'Is this email address correct?',
  },
  password: {
    required: 'Please enter your password.',
  },
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formValidate = this.formValidate.bind(this);

    this.state = ({
      formErrors: {
        password: "",
        emailAddress: "",
      },
    });
  }

  formValidate() {
    const input = {
      emailAddress: this.emailAddress.input.value,
      password: this.password.input.value,
    };

    const formErrors = customFormValidator(input, rules, messages);

    if (!formErrors) {
      this.handleSubmit();
    } else {
      this.setState({ formErrors });
    }
  }

  handleSubmit() {
    const { history } = this.props;

    Meteor.loginWithPassword(this.emailAddress.input.value, this.password.input.value, (error) => {
      if (error) {
        Bert.alert('Please check your username or password.', 'danger');
      } else {
        Bert.alert('Welcome back!', 'success');
        history.push('/signup');
      }
    });
  }

  render() {
    return (
      <div className="Login">
        <h2>Sign In To Your Account</h2>

        <form onSubmit={event => event.preventDefault()}>

          <TextField
            name="username"
            floatingLabelText="Email Address"
            ref={(input) => { this.emailAddress = input; }}
            errorText={this.state.formErrors.emailAddress}
          /> <br />

          <TextField
            name="password"
            type="password"
            floatingLabelText="Password"
            ref={(password) => { this.password = password; }}
            errorText={this.state.formErrors.password}
          />

          <RaisedButton
            type="submit"
            fullWidth
            onClick={this.formValidate}
            style={{ margin: "35px 0 20px 0" }}
          >
            Log In
          </RaisedButton>

        </form>


      </div>);
  }
}

Login.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default Login;

/* <Row>
  <Col xs={12} sm={6} md={5} lg={4}>
    <h4 className="page-header">Log In</h4>
    <Row>
      <Col xs={12}>
        <OAuthLoginButtons
          services={['facebook', 'github', 'google']}
          emailMessage={{
            offset: 100,
            text: 'Log In with an Email Address',
          }}
        />
      </Col>
    </Row>
    <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Email Address</ControlLabel>
        <input
          type="email"
          name="emailAddress"
          ref={emailAddress => (this.emailAddress = emailAddress)}
          className="form-control"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel className="clearfix">
          <span className="pull-left">Password</span>
          <Link className="pull-right" to="/recover-password">Forgot password?</Link>
        </ControlLabel>
        <input
          type="password"
          name="password"
          ref={password => (this.password = password)}
          className="form-control"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">Log In</Button>
      <AccountPageFooter>
        <p>{'Don\'t have an account?'} <Link to="/signup">Sign Up</Link>.</p>
      </AccountPageFooter>
    </form>
  </Col>
</Row> */
