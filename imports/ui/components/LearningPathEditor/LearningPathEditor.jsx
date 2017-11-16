import React from 'react';
import PropTypes from 'prop-types';
import { Random } from 'meteor/random';
import { Bert } from 'meteor/themeteorchef:bert';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { debounce, kebabCase } from 'lodash';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import customFormValidator from '../../../modules/custom-form-validator';

// if (Meteor.isClient) {
import './LearningPathEditor.scss';
// }

const pathRules = {
  title: {
    required: true,
    minLength: 10,
    maxLength: 30,
  },
  description: {
    required: true,
  },
  "skills.0": {
    required: true,
  },
};

const pathMessages = {
  title: {
    required: 'Please enter a title for your Learning Path.',
    minLength: 'Please enter at least 10 characters for your Title.',
    maxLength: 'Please enter no more than 30 characters for your Title.',
  },
  description: {
    required: 'Please enter a short description to explain what this Learning Path teaches, and why it is important.',
  },
  "skills.0": {
    required: 'Please enter at least one skill/topic to tag what this Learning Path is about.',
  },
};

const resourceRules = {
  title: {
    required: true,
  },
  description: {
    required: true,
  },
  url: {
    url: true,
    required: true,
  },
  thumbnail: {
    url: true,
  },
};

const resourceMessages = {
  title: {
    required: 'Please enter a title for the Resource.',
  },
  description: {
    required: 'Please enter a description for the Resource to explain why it is important.',
  },
  url: {
    url: 'Must be a valid URL',
    required: 'Please enter a valid URL.',
  },
  thumbnail: {
    url: 'Must be a valid URL',
  },
};

// reordering drag and drop items on drop
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// styling drag and drop items
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 16,
  margin: 5,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#f4f4f4',

  // styles we need to apply on draggables
  ...draggableStyle,
});

export default class LearningPathEditor extends React.Component {

  constructor(props) {
    super(props);
    this.formValidate = this.formValidate.bind(this);
    this.addNewResource = this.addNewResource.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.editThis = this.editThis.bind(this);
    this.retrievePageData = debounce(this.retrievePageData.bind(this), 700);
    this.addSkill = this.addSkill.bind(this);
    this.clearSkills = this.clearSkills.bind(this);
    this.removeOneSkill = this.removeOneSkill.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.deletePath = this.deletePath.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);

    this.state = {
      editingIndex: null,
      name: '',
      title: '',
      description: '',
      skills: [],
      skillTemp: '',
      resources: [],
      formErrors: {},
      formErrorsResources: {},
      deleteDialogOpen: false,
    };
  }

  componentWillMount() {
    const { path } = this.props;
    if (path) {
      this.setState({
        title: path.title,
        description: path.description,
        skills: path.skills,
        resources: path.resources,
      });
    }
  }

  // Handles rearranging of state when resources are dragged around.
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state[result.source.droppableId],
      result.source.index,
      result.destination.index,
    );

    this.setState({
      [result.source.droppableId]: [...items],
      formErrors: {},
      formErrorsResources: {},
    });
  }

  // Gets thumbnail, title, and description
  retrievePageData(index, field) {
    const urlInput = this.state.resources[index][field];
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    const url = urlInput.match(urlRegex);

    if (url) {
      Meteor.call('utility.remoteGet', url[0], (err, response) => {
        if (err) {
          this.setState({
            loadingSite: false,
          });
        } else {
          const titleGet = (/<title(.*?)>(.*?)<\/title>/m).exec(response.content);
          const descriptionGet = (/<meta name="description" content="(.*?)"/m).exec(response.content);

          const titleAndDescription = [
              ['title', ((titleGet) ? titleGet[2] : null)],
              ['description', ((descriptionGet) ? descriptionGet[1] : null)],
          ];

          const images = [];

          const regExes = [
              ['png', /(content="([^"><]*?).png(\?[^"><]*?)?")|(href="([^"><]*?).png(\?[^"><]*?)?")|(src="([^"><]*?).png(\?[^"><]*?)?")/gim],
              ['jpg', /(content="([^"><]*?).jpg(\?[^"><]*?)?")|(src="([^"><]*?).jpg(\?[^"><]*?)?")/gim],
              ['gif', /(content="([^"><]*?).gif(\?[^"><]*?)?")|(src="([^"><]*?).gif(\?[^"><]*?)?")/gim],
          ];

            /**
              Get list of image URLs in html retrieved from URL.
              Trying to grab image labeled as 'main image' by website,
              typically used in content= and html= tags at the top of the page.
              First image is used currently, but may use this code to allow
              user to select from multiple images later on.
            */
          regExes.forEach((regEx) => {
            for (let i = 1; i < 3; i += 1) {
              const logoImg = (regEx[1]).exec(response.content);
              if (logoImg === null) break;
              const useImage5 = (logoImg[5]) ? (logoImg[5]) : logoImg[8];
              const whichImg = (logoImg[2]) ? logoImg[2] : useImage5;
              if (whichImg === null) break;
              if (!images.includes(`${whichImg}.${regEx[0]}`) && !images.includes(`http://${whichImg}.${regEx[0]}`)) {
                const getHTTP = whichImg.substring(0, 4);
                const getForwardSlashes = whichImg.substring(0, 2);
                const getRelative = whichImg.substring(0, 1);
                if (getHTTP === 'http') {
                  images.push(`${whichImg}.${regEx[0]}`);
                } else if (getForwardSlashes === '//') {
                  images.push(`http:${whichImg}.${regEx[0]}`);
                } else if (getRelative === '/') {
                  const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
                  const imageDomain = url[0].match(domainRegex);
                  images.push(`${imageDomain[0]}${whichImg}.${regEx[0]}`);
                } else {
                  images.push(`http://${whichImg}.${regEx[0]}`);
                }
              }
            }
          });

          const toUpdate = [...this.state.resources];

            // Use the first image found on the page
          if (images[0]) toUpdate[index].thumbnail = images[0];

            // Decode HTML strings to display special title characters correctly
          titleAndDescription.forEach((item) => {
            if (item[1]) {
              // DOMParser is experimental as of Oct 23, 2017.
              // May not be compatible with mobile devices.
              const parser = new DOMParser();
              const dom = parser.parseFromString(
                    `<!doctype html><body>${item[1]}`,
                    'text/html');
              const decodedString = dom.body.textContent;

              toUpdate[index][item[0]] = decodedString;
            }
          });

            // If URL is valid, turn loading state off and update Resources with toUpdate.
          this.setState({
            resources: [...toUpdate],
            loadingSite: false,
          });
        }
      });
    } else {
        // If URL is not valid, turn loading state off anyway.
      this.setState({
        loadingSite: false,
      });
    }
  }

  // Deletes one resource at index
  deleteOne(index) {
    return () => {
      const withDeletedIndex = [...this.state.resources];
      withDeletedIndex.splice(index, 1);
      this.setState({
        resources: [...withDeletedIndex],
        formErrors: {},
        formErrorsResources: {},
      });
    };
  }

  // Removes all resources
  removeAll() {
    this.setState({
      resources: [],
      formErrors: {},
      formErrorsResources: {},
    });
  }

  deletePath() {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  handleDialogClose() {
    this.setState({
      deleteDialogOpen: false,
    });
  }

  deleteConfirm() {
    if (this.props.path) {
      Meteor.call('learning-paths.remove', { _id: this.props.path._id }, (err) => {
        if (err) {
          Bert.alert({
            message: err.reason,
            type: 'alert',
            icon: 'fa-ban',
          });
        } else {
          Bert.alert({
            message: 'Path successfully deleted!',
            type: 'success',
            icon: 'fa-trash',
          });
          this.props.history.push('/my-paths')
        }
      })
    }
    this.setState({
      deleteDialogOpen: false,
    });
  }

  // Validate form before submission, create formErrors.
  formValidate() {
    const input = {
      title: this.state.title,
      description: this.state.description,
      skills: this.state.skills,
      resources: this.state.resources,
    };

    // Call validator on title, description and skills:
    const formErrors = customFormValidator(input, pathRules, pathMessages);

    // Call validator on all Resources
    const addResourcesErrors = {};
    let isResourceError = false;
    input.resources.forEach((resource, index) => {
      const formErrorsResources = customFormValidator(resource, resourceRules, resourceMessages);
      if (formErrorsResources) {
        isResourceError = true;
        addResourcesErrors[index] = formErrorsResources;
      }
    });

    // If more than 3 skills,
    if (!formErrors['skills.0'] && input.skills.length > 3) {
      formErrors['skills.0'] = 'Please create a focused learning path with 3 or less skills. Nest learning paths for more complex paths.';
    }

    if (input.resources.length < 1) {
      formErrors.resources = 'Please add at least one resource to your learning path.';
    }

    if (!formErrors && !isResourceError) {
      this.handleSubmit(input);
      this.setState({
        formErrorsResources: {},
        formErrors: {},
      });
    } else {
      Bert.alert('Please fix errors marked in red before submission.', 'danger');
      this.setState({
        formErrorsResources: addResourcesErrors,
        formErrors,
      });
    }
  }

  // Submit input to update or insert Learning Path methods
  handleSubmit(input) {
    const pathToAdd = { ...input };
    const { history } = this.props;
    const existingPathId = this.props.path && this.props.path._id;
    const methodToCall = existingPathId ? 'learning-paths.update' : 'learning-paths.insert';

    if (existingPathId) pathToAdd._id = existingPathId;

    Meteor.call(methodToCall, pathToAdd, (error, documentId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingPathId ? 'Learning Path Updated!' : 'Learning Path Added!';
        Bert.alert(confirmation, 'success');

        // Fixes problem with React-Router keeping scroll position on navigation, in some cases.
        window.scrollTo(0, 0);

        history.push(`/learning-path/${documentId}/`);
      }
    });
  }

  // Changes state of field passed in
  handlePathFieldChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  // Changes state of resource field passed in
  handleFieldChange(e, index, field) {
    // Change resources
    const toUpdate = [...this.state.resources];
    toUpdate[index][field] = e.target.value;

    this.setState({
      resources: [...toUpdate],
    });

    if (field === 'url') {
      this.retrievePageData(index, field);
      this.setState({
        loadingSite: true,
      });
    }
  }

  // Add one new resource to state.
  addNewResource() {
    const newResourceState = [...this.state.resources];
    const newResource = {
      _id: Random.id(),
      title: 'Title of Resource',
      description: '',
      url: 'http://www.example.com',
      thumbnail: '',
    };

    newResourceState.push(newResource);

    this.setState({
      resources: [...newResourceState],
      formErrors: {},
    });
  }

  // Open editor for resource at passed in index, close other editors.
  editThis(index) {
    return () => {
      if (this.state.editingIndex === index) {
        this.setState({
          editingIndex: null,
        });
      } else {
        this.setState({
          editingIndex: index,
        });
      }
    };
  }

  // Add current skill, insert as kebab-case, clear form.
  addSkill() {
    const addSkills = [...this.state.skills];

    if (this.state.skillTemp && !addSkills.includes(kebabCase(this.state.skillTemp))) {
      addSkills.push(kebabCase(this.state.skillTemp));
    }

    this.setState({
      formErrors: {},
      skillTemp: '',
      skills: [...addSkills],
    });
  }

  // Clear all skills
  clearSkills() {
    this.setState({
      formErrors: {},
      skills: [],
    });
  }

  // Remove one skill at index passed in
  removeOneSkill(index) {
    return () => {
      const toRemove = [...this.state.skills];
      toRemove.splice(index, 1);
      this.setState({
        skills: [...toRemove],
        formErrors: {},
      });
    };
  }

  render() {
    return (
      <div className="editor-wrapper">
        <div className="path-description-input">
          <div className="submit-delete">
            <RaisedButton
              backgroundColor="#009688"
              style={{ marginRight: 10 }}
              onClick={this.formValidate}
            >
              <span style={{ color: '#FFFFFF' }}>Submit</span>
            </RaisedButton>
            {
              (this.props.path) ?
                <RaisedButton
                  backgroundColor="#d9534f"
                  style={{ marginRight: 10 }}
                  onClick={this.deletePath}
                >
                  <span style={{ color: 'white' }}>Delete</span>
                </RaisedButton>
                :
                ''
            }
          </div>
          <Paper className="paper-box">
            <h4>{'Enter a Goal / Title'}</h4>
            <p>{'If somebody follows this Learning Path to the end, what will they learn, or what will they become?'}</p>
            <p>{'eg. "Become A React Native Developer", "Learn Ruby"'}</p>

            <TextField
              id="goal-field"
              value={this.state.title}
              floatingLabelText="Goal / Title"
              onChange={e => this.handlePathFieldChange(e, 'title')}
              errorText={(this.state.formErrors && this.state.formErrors.title) ? this.state.formErrors.title : ''}
            />
          </Paper>
          <Paper className="paper-box">
            <h4>Add a Description</h4>
            <p>A great description answers these two questions:</p>
            <p>1. Why is this Learning Path a great way to reach this Goal?</p>
            <p>2. Are there any pre-requisites required before starting?</p>
            <TextField
              id="description-field"
              multiLine
              rows={3}
              rowsMax={10}
              style={{ width: '70%' }}
              value={this.state.description}
              floatingLabelText="Description"
              onChange={e => this.handlePathFieldChange(e, 'description')}
              errorText={(this.state.formErrors && this.state.formErrors.description) ? this.state.formErrors.description : ''}
            />
          </Paper>
          <Paper className="paper-box">
            <h4>Add Skills Learned</h4>
            <p>What skills will somebody learn if they follow your Learning Path?</p>
            <p>eg. react, react native, npm, webpack etc.</p>
            <div className="skill-input">
              {/* TODO Add ability to hit enter to add skills,
                and refocus on field after enter to quickly add another.
              */}
              <TextField
                id="skills-field"
                style={{ width: 250 }}
                value={this.state.skillTemp}
                floatingLabelText="Skills / Topics"
                onChange={e => this.handlePathFieldChange(e, 'skillTemp')}
                errorText={(this.state.formErrors && this.state.formErrors["skills.0"]) ? this.state.formErrors["skills.0"] : ''}
              />
              <FontIcon
                color="rgba(0,0,0,0.3)"
                hoverColor="rgba(0,0,0,0.7)"
                className="material-icons pointer"
                onClick={this.addSkill}
              >
                add
              </FontIcon>
              <FontIcon
                color="rgba(0,0,0,0.3)"
                hoverColor="rgba(0,0,0,0.7)"
                className="material-icons pointer"
                onClick={this.clearSkills}
              >
                clear
              </FontIcon>
            </div>
            <div className="skill-list" style={{ marginTop: (this.state.formErrors['skills.0']) ? 40 : 0 }}>
              {this.state.skills.map((skillItem, index) => (
                <Chip
                  style={{ margin: 2 }}
                  key={skillItem}
                  onRequestDelete={this.removeOneSkill(index)}
                >
                  {skillItem}
                </Chip>
            ))}
            </div>
          </Paper>

          <Paper className="paper-box">
            <h4>Add Resources</h4>
            <p>Provide Resources that create a path to reach the Goal.</p>
            <p>Add great online courses, articles, guides, references.</p>
            <p>NOTE: You can also nest Learning Paths.
              Add the link to another Learning Path to
              simplify goals that require more steps!</p>

            <div className="resource-buttons">
              <RaisedButton
                style={{ marginRight: 10 }}
                onClick={this.addNewResource}
              >
              + Add New
              </RaisedButton>
              <RaisedButton
                style={{ marginRight: 10 }}
                onClick={this.removeAll}
              >
                Clear All
              </RaisedButton>
              <RaisedButton
                backgroundColor="#009688"
                style={{ marginRight: 10 }}
                onClick={this.formValidate}
              >
                <span style={{ color: '#FFFFFF' }}>Submit</span>
              </RaisedButton>
            </div>
          </Paper>
        </div>
        <Dialog
          title="Delete Learning Path"
          actions={
            <FlatButton
              label="Confirm"
              keyboardFocused={true}
              onClick={this.deleteConfirm}
            />
          }
          modal={false}
          open={this.state.deleteDialogOpen}
          onRequestClose={this.handleDialogClose}
        >
          Are you sure you want to delete this Learning Path? This action cannot be undone.
        </Dialog>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="grab-cursor">
            {(this.state.formErrors.resources) ?
              <p style={{ color: 'red' }}>{this.state.formErrors.resources}</p>
              :
              ''
            }
            <Droppable droppableId="resources">
              {provided => (
                <div
                  ref={provided.innerRef}
                  className="inner-droppable-container"
                >
                  <div
                    className="inner-droppable"
                    style={{ height: (this.state.resources.length * 80), paddingBottom: 400 }}
                  >
                    {this.state.resources.map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id}>
                        {(provided1, snapshot1) => (
                          <div>
                            <div
                              ref={provided1.innerRef}
                              style={getItemStyle(
                              provided1.draggableStyle,
                              snapshot1.isDragging,
                            )}
                              className="dropped-components"
                              {...provided1.dragHandleProps}
                            >
                              <div className="title-box">
                                <div className="title-box-left">
                                  <FontIcon
                                    className="material-icons"
                                    color="rgba(0,0,0,0.2)"
                                    style={{ marginRight: 10 }}
                                  >
                                  drag_handle
                                </FontIcon>
                                  <p className="heading-number">
                                    {`${index + 1}`}
                                  </p>
                                  <FontIcon
                                    hoverColor="rgba(0,0,0,0.5)"
                                    onClick={this.editThis(index)}
                                    className="material-icons pointer"
                                    color={(this.state.editingIndex === index) ?
                                    "rgba(0,0,0,0.7)"
                                    :
                                    "rgba(0,0,0,0.2)"
                                  }
                                    style={{ marginRight: 15 }}
                                  >
                                  edit
                                </FontIcon>
                                  <p className="heading-title">
                                    {(item.title.length < 55) ?
                                      item.title
                                      :
                                      `${item.title.substring(0, 55)}...`}
                                  </p>
                                </div>
                                <div className="title-box-button">
                                  <Chip
                                    style={{ marginRight: 5 }}
                                  >
                                    {item.url.substring(0, 45)}
                                  </Chip>
                                </div>
                                {(this.state.formErrorsResources[index]) ?
                                  <Chip
                                    style={{
                                      fontSize: 10,
                                      backgroundColor: 'red',
                                      color: 'white',
                                    }}
                                  >
                                  error
                                </Chip>
                                : ''
                              }
                                {(this.state.resources[index].thumbnail) ?
                                  <div className="title-box-button">
                                    <img
                                      alt=""
                                      src={this.state.resources[index].thumbnail}
                                      style={{ maxWidth: 100, maxHeight: 60 }}
                                      onError={this.invalidImage}
                                    />
                                  </div>
                                :
                                ''
                              }
                                <div className="title-box-button">
                                  <FontIcon
                                    onClick={this.deleteOne(index)}
                                    className="material-icons pointer"
                                    color="rgba(0,0,0,0.2)"
                                    hoverColor="rgba(0,0,0,0.5)"
                                  >
                                remove_circle
                              </FontIcon>
                                </div>

                              </div>
                              {(this.state.editingIndex === index) ?
                                <div className="fields-box">
                                  <div>
                                    <TextField
                                      style={{ width: '60%' }}
                                      onMouseDown={e => e.stopPropagation()}
                                      onKeyDown={e => e.stopPropagation()}
                                      value={this.state.resources[index].url}
                                      floatingLabelText="URL of Resource"
                                      onChange={e => this.handleFieldChange(e, index, 'url')}
                                      errorText={(this.state.formErrorsResources[index] && this.state.formErrorsResources[index].url) ? this.state.formErrorsResources[index].url : ''}
                                    />
                                    {(this.state.loadingSite) ?
                                      <RefreshIndicator
                                        size={30}
                                        left={10}
                                        top={0}
                                        status="loading"
                                        style={{
                                          display: 'inline-block',
                                          position: 'relative',
                                        }}
                                      />
                                  :
                                  ''
                                }

                                  </div>


                                  <TextField
                                    onMouseDown={e => e.stopPropagation()}
                                    onKeyDown={e => e.stopPropagation()}
                                    value={this.state.resources[index].title}
                                    floatingLabelText="Title of Resource"
                                    onChange={e => this.handleFieldChange(e, index, 'title')}
                                    errorText={(this.state.formErrorsResources[index] && this.state.formErrorsResources[index].title) ? this.state.formErrorsResources[index].title : ''}
                                  />
                                  <TextField
                                    style={{ width: '80%' }}
                                    multiLine
                                    rows={3}
                                    rowsMax={6}
                                    onMouseDown={e => e.stopPropagation()}
                                    onKeyDown={e => e.stopPropagation()}
                                    value={this.state.resources[index].description}
                                    floatingLabelText="Description of Resource"
                                    onChange={e => this.handleFieldChange(e, index, 'description')}
                                    errorText={(this.state.formErrorsResources[index] && this.state.formErrorsResources[index].description) ? this.state.formErrorsResources[index].description : ''}
                                  />
                                  <div>
                                    <TextField
                                      onMouseDown={e => e.stopPropagation()}
                                      onKeyDown={e => e.stopPropagation()}
                                      value={this.state.resources[index].thumbnail}
                                      floatingLabelText="Thumbnail Image URL (Optional)"
                                      onChange={e => this.handleFieldChange(e, index, 'thumbnail')}
                                      errorText={(this.state.formErrorsResources[index] && this.state.formErrorsResources[index].thumbnail) ? this.state.formErrorsResources[index].thumbnail : ''}
                                    />
                                    {(this.state.resources[index].thumbnail) ?
                                      <img
                                        alt=""
                                        src={this.state.resources[index].thumbnail}
                                        style={{ maxWidth: 200, maxHeight: 130, marginLeft: 15 }}
                                        onError={this.invalidImage}
                                      />
                                  :
                                  ''
                                }
                                  </div>

                                </div>
                              :
                              ''

                            }
                            </div>
                            {provided1.placeholder}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    );
  }
}

LearningPathEditor.defaultProps = {
  path: null,
};

// TODO edit proptypes
LearningPathEditor.propTypes = {
  path: PropTypes.object,
  history: PropTypes.object.isRequired,
};
