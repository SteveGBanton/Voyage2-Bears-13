/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';

import Loading from '../../../components/Loading/Loading.jsx'

import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';

import customFormValidator from '../../../../modules/custom-form-validator';

import './ClientProfile.scss';

const rules = {
  firstName: {
    required: true,
  },
  lastName: {
    required: true,
  },
  emailAddress: {
    required: true,
    email: true,
  },
  newPassword: {
    password: true,
  },
};

const messages = {
  firstName: {
    required: 'What\'s your first name?',
  },
  lastName: {
    required: 'What\'s your last name?',
  },
  emailAddress: {
    required: 'Need an email address here.',
    email: 'Is this email address correct?',
  },
  currentPassword: {
    required: 'Current password is required to change profile.',
  },
  newPassword: {
    password: "Keep your account safe: at least 9 characters required, at least one uppercase letter and one number. Special characters allowed: $%@#£€*?&",
  },
}

class ClientProfile extends React.Component {
  constructor(props) {
    super(props);

    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOAuthUser = this.renderOAuthUser.bind(this);
    this.renderPasswordUser = this.renderPasswordUser.bind(this);
    this.renderProfileForm = this.renderProfileForm.bind(this);
    this.formValidate = this.formValidate.bind(this);

    this.state = ({
      formErrors: {
        firstName: "",
        lastName: "",
        emailAddress: "",
        currentPassword: "",
        newPassword: "",
      },
      currentEmail: props.user.emails[0].address,
      verifiedEmail: props.user.emails[0].verified,
    })
  }

  componentDidMount() {
    const component = this;
  }

  resendVerification() {
    Meteor.call('users.sendVerificationEmail', (err) => {
      if (err) {
        Bert.alert('Error sending verification email', 'danger')
      } else {
        Bert.alert('Verification email sent to address on file.', 'success')
      }

    });
  }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === 'password' ? 'password' : 'oauth';
  }

  formValidate() {

    const input = {
      emailAddress: this.emailAddress.input.value,
      firstName: this.firstName.input.value,
      lastName: this.lastName.input.value,
      currentPassword: this.currentPassword.input.value,
      newPassword: this.newPassword.input.value,
    }

    const formErrors = customFormValidator(input, rules, messages)
    let currentPwdRequired = true;
    console.log(formErrors)

    if (this.newPassword.input.value && this.currentPassword.input.value === '') {
      formErrors.currentPassword = 'Current password is required to change password'
    } else {
      currentPwdRequired = false
    }

    if (!formErrors && currentPwdRequired === false) {
      this.handleSubmit()
      this.setState({formErrors})
    } else {
      this.setState({formErrors})
    }
    return
  }

  handleSubmit() {
    const verifiedEmail = this.state.verifiedEmail;
    const currentEmail = this.state.currentEmail;
    let emailChanged = false;

    const profile = {
      previousEmailAddress: currentEmail,
      emailAddress: this.emailAddress.input.value,
      profile: {
        name: {
          first: this.firstName.input.value,
          last: this.lastName.input.value,
        },
      },
    };

    if (this.emailAddress.input.value !== currentEmail) {
      emailChanged = true;
    }

    Meteor.call('users.editProfile', profile, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        if (emailChanged || verifiedEmail === false) {
          Meteor.call('users.sendVerificationEmail');
        }
        Bert.alert('Profile updated!', 'success');
      }
    });

    if (this.newPassword.input.value) {
      Accounts.changePassword(this.currentPassword.input.value, this.newPassword.input.value, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          this.currentPassword.input.value = '';
          this.newPassword.input.value = '';
        }
      });
    }
  }

  renderOAuthUser(loading, user) {
    return (<div className="OAuthProfile">
      {Object.keys(user.services).map(service => (
        <div key={service} className={`LoggedInWith ${service}`}>
          <div className="ServiceIcon"><i className={`fa fa-${service === 'facebook' ? 'facebook-official' : service}`} /></div>
          <p>{`You're logged in with ${capitalize(service)} using the email address ${user.services[service].email}.`}</p>
        </div>
      ))}
    </div>);

    //TODO - add other fields to OAuth user Profile.
  }

  renderPasswordUser(loading, user) {
    return (
        <form className="profile-edit" onSubmit={event => event.preventDefault()}>
          <div className="profile-edit-1">

            <TextField
              defaultValue={user.username}
              disabled
              name="userName"
              floatingLabelText="Username (cannot be changed)"
            />

            <TextField
              defaultValue={user.profile.name.first}
              name="firstName"
              floatingLabelText="First Name"
              ref={input => (this.firstName = input)}
              errorText={this.state.formErrors.firstName}
            /><br/>

            <TextField
              defaultValue={user.profile.name.last}
              name="lastName"
              floatingLabelText="Last Name"
              ref={input => (this.lastName = input)}
              errorText={this.state.formErrors.lastName}
            /><br/>

          </div>
      <div className="profile-edit-2">

        <TextField
          defaultValue={user.emails[0].address}
          name="emailAddress"
          floatingLabelText="Email Address"
          ref={input => (this.emailAddress = input)}
          errorText={this.state.formErrors.emailAddress}
        />

        {
          (user.emails[0].verified === false)
          ? (<IconButton
              touch={true}
              tooltip="Not verified: click to resend verification email"
              tooltipPosition="bottom-center"
              onClick={this.resendVerification}
             >
               <FontIcon className="material-icons">email</FontIcon>
             </IconButton>)
          : (<IconButton
              touch={true}
              tooltip="Email Verified"
              tooltipPosition="bottom-center"
             >
               <FontIcon className="material-icons">checkmark</FontIcon>
             </IconButton>)
        }

          <br/>
        <TextField
          name="currentPassword"
          type="password"
          floatingLabelText="Current Password"
          ref={currentPassword => (this.currentPassword = currentPassword)}
          errorText={this.state.formErrors.currentPassword}
        /><br/>

        <TextField
          name="newPassword"
          type="password"
          floatingLabelText="New Password"
          ref={newPassword => (this.newPassword = newPassword)}
          errorText={this.state.formErrors.newPassword}
        /><br/><br/><br/>

        <div>

        <RaisedButton type="submit" onClick={this.formValidate}>Edit Profile</RaisedButton>

        </div>

        </div>
      </form>)
  }

  renderProfileForm(loading, user) {
    return !loading ? ({
      password: this.renderPasswordUser,
      oauth: this.renderOAuthUser,
    }[this.getUserType(user)])(loading, user) : <Loading />;
  }

  render() {
    const { loading, user } = this.props;
    {console.log(this.props)}
    return (<div className="Profile">
        <h1>Edit Profile</h1>
        {this.renderProfileForm(loading, user)}
    </div>);
  }
}

ClientProfile.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
  };
}, ClientProfile);
