import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { debounce, kebabCase } from 'lodash'

import RefreshIndicator from 'material-ui/RefreshIndicator';
import OAuthLoginButtons from '../../../components/OAuthLoginButtons/OAuthLoginButtons.jsx';
import customFormValidator from '../../../../modules/custom-form-validator';

// material-ui
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { orange500 } from 'material-ui/styles/colors';

const signupFormRules = {
  firstName: {
    required: true,
    maxLength: 20,
  },
  lastName: {
    required: true,
    maxLength: 20,
  },
  emailAddress: {
    required: true,
    maxLength: 40,
    email: true,
  },
  username: {
    required: true,
    maxLength: 22,
  },
  password: {
    required: true,
    password: true,
  },
}

const signupErrorMessages = {
  firstName: {
    required: "This field is required",
  },
  lastName: {
    required: "This field is required",
  },
  emailAddress: {
    required: "This field is required",
    email: "Please enter a valid email",
  },
  username: {
    required: "This field is required",
  },
  password: {
    required: "This field is required",
    password: "Keep your account safe: at least 9 characters required, at least one uppercase letter and one number. Special characters allowed: $%@#£€*?&",
  },
}

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createUsername = this.createUsername.bind(this);
    this.formValidate = this.formValidate.bind(this);
    this.editUsername = this.editUsername.bind(this);
    this.editUsernameWithOrgName = this.editUsernameWithOrgName.bind(this)

    this.state = ({
      formErrors: {
        firstName: "",
        lastName: "",
        orgName: "",
        password: "",
        emailAddress: "",
      },
      username: "",
      usernameClean: "",
      userNameVerified: false,
      usernameLoading: false,
    })
  }

  createUsername = debounce(function(field) {

      let inputFieldToUse = (field === 'orgName') ? this.orgName.input.value : this.username.input.value;

      // put into username format
      let input = kebabCase(inputFieldToUse);
      let number = 0;

      // setting username functions
      const setUsernameTrue = (function(potentialUserName) {
        this.setState({ usernameClean: potentialUserName });
        this.setState({ username: potentialUserName });
        this.setState({ usernameLoading: false });
        this.setState({ userNameVerified: true });
      }).bind(this)

      const setUsernameFalse = (function(potentialUserName) {
        this.setState({ usernameClean: potentialUserName });
        this.setState({ username: potentialUserName });
        this.setState({ usernameLoading: false });
        this.setState({ userNameVerified: false });
        number += 1;
        checkUser(`${input}-${number}`);
      }).bind(this)

      //check if exists already
      function checkUser(potentialUserName) {
        Meteor.call('users.checkUsername', {potentialUserName}, (error, count) => {
          if (error) {
            console.log(error.reason)
          } else {
            if (count > 0) {
              setUsernameFalse(potentialUserName);
              return false;
            } else {
              setUsernameTrue(potentialUserName);
              return true;
            }
          }
        });
      }

      checkUser(input);

    }, 1500)


  formValidate() {

    const input = {
      emailAddress: this.emailAddress.input.value,
      password: this.password.input.value,
      firstName: this.firstName.input.value,
      lastName: this.lastName.input.value,
      username: this.state.username
    }

    let formErrors = customFormValidator(input, signupFormRules, signupErrorMessages)

    // Check if formErrors is not false, username is verified and not loading. If empty and username is verified, submit form.
    if (!formErrors && this.state.userNameVerified === true && this.state.usernameLoading === false) {
      this.handleSubmit()
    } else {
      this.setState({formErrors})
    }
    return

  }

  handleSubmit() {

    const { history } = this.props;

    const newAdmin = {
      email: this.emailAddress.input.value,
      password: this.password.input.value,
      username: this.state.username,
      profile: {
        name: {
          first: this.firstName.input.value,
          last: this.lastName.input.value,
        },
      },
    }

    Meteor.call('users.createNewUser', newAdmin, (error, res) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
        console.log(error)
      } else {
        Meteor.loginWithPassword(this.emailAddress.input.value, this.password.input.value, (error) => {
          if (error) {
            Bert.alert('Error Logging In', 'danger');
          } else {
            Meteor.call('users.sendVerificationEmail');
            Bert.alert('Welcome!', 'success');
            history.push(`/dashboard`);
          }
        });
      }
    });

  }

  editUsername() {
    this.setState({ username: this.username.input.value });
    this.createUsername('username');
    this.setState({ usernameLoading: true })
    this.setState({ "formErrors.username": "" })
  }

  editUsernameWithOrgName() {
    this.createUsername('orgName');
    this.setState({ usernameLoading: true })
    this.setState({ "formErrors.username": "" })
  }

  render() {
    return (
      <div className="Signup">

        <h2>Create New Account</h2>
        <OAuthLoginButtons
          services={['']}
        />

        <form onSubmit={event => event.preventDefault()}>

        <TextField
          name="orgID"
          floatingLabelText="Please Pick A Unique Username"
          errorStyle={(this.state.formErrors.username) ? {} : { color: orange500 }}
          value={this.state.username}
          onChange={this.editUsername}
          ref={input => (this.username = input)}
          errorText={(this.state.formErrors.username) ? this.state.formErrors.username : 'No spaces or capital letters, please.'}
          maxLength='22'
        />

        {
          (this.state.usernameLoading)
          ? <RefreshIndicator
            size={25}
            left={10}
            top={-55}
            status="loading"
            style={{display: 'inline-block', position: 'relative'}}
          />
          : ''
        }

        <TextField
          name="firstName"
          floatingLabelText="First Name"
          errorText=""
          ref={input => (this.firstName = input)}
          errorText={this.state.formErrors.firstName}
        /><br/>

        <TextField
          name="lastName"
          floatingLabelText="Last Name"
          ref={input => (this.lastName = input)}
          errorText=""
          errorText={this.state.formErrors.lastName}
        /><br/>

        {/*email address field is called username to help password managers*/}
        <TextField
          name="username"
          floatingLabelText="Email Address"
          ref={input => (this.emailAddress = input)}
          errorText=""
          errorText={this.state.formErrors.emailAddress}
        /><br/>

        <TextField
          name="password"
          type="password"
          floatingLabelText="Password"
          ref={password => (this.password = password)}
          errorText=""
          errorText={this.state.formErrors.password}
        />

        <div>

        <RaisedButton
          type="submit"
          fullWidth={true}
          onClick={this.formValidate}
          style={{margin: "35px 0 35px 0"}}
        >
          Sign Up
        </RaisedButton>

        </div>

        <p>Already have an account? <Link to="/login">Log In</Link>.</p>

        </form>
    </div>);
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};
