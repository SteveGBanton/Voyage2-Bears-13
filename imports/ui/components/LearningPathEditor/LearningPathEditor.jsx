import React from 'react';
import PropTypes from 'prop-types';
import { Random } from 'meteor/random';
import { Bert } from 'meteor/themeteorchef:bert';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { debounce } from 'lodash';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';

import customFormValidator from '../../../modules/custom-form-validator';
import './LearningPathEditor.scss';

const pathRules = {
  title: {
    required: true,
  },
  description: {
    required: true,
  },
  skills: {
    required: true,
  }
};

const pathMessages = {
  title: {
    required: 'Please enter a title for your Learning Path.',
  },
  description: {
    required: 'Please enter a short description to explain what this Learning Path teaches, and why it is important.',
  },
  skills: {
    required: 'Please enter at least one skill to tag what this Learning Path is about.',
  }
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
  }
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
  }
};

import RaisedButton from 'material-ui/RaisedButton';

// const PathExample = {
//   title: {
//     type: String,
//     label: "The name of this learning path",
//   },
//   description: {
//     type: String,
//     label: "Description of the learning path",
//   },
//   skills: {
//     type: Array,
//     label: "Skills focused on in the path",
//   },
//   'skills.$': String,
//   resources: {
//     type: Array,
//     label: "All resources in this path",
//   },
//   'resources.$': {
//     type: resourceSchema,
//     label: "An instance of a resource",
//   },
//   mentor: {
//     type: String,
//     label: "The mentor's ID",
//     regEx: SimpleSchema.RegEx.Id,
//   },
// }
//
// const ResourceExample = {
//   _id: {
//     type: String,
//     label: "ID of resource",
//     autoValue() {
//       if (!this.isSet) return Random.id();
//     },
//   },
//   title: {
//     type: String,
//     label: "Name of resource",
//   },
//   description: {
//     type: String,
//     label: "Description of resource",
//     min: 200,
//   },
//   url: {
//     type: String,
//     label: "URL to resource",
//     regEx: SimpleSchema.RegEx.Domain,
//   },
//   thumbnail: {
//     type: String,
//     label: "Image URL for resource",
//     regEx: SimpleSchema.RegEx.Domain,
//   }
// }

// help with reordering
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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
    this.testForValidURL = this.testForValidURL.bind(this);
    this.addNewResource = this.addNewResource.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.editThis = this.editThis.bind(this);
    this.getPageData = this.getPageData.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.clearSkills = this.clearSkills.bind(this);
    this.removeOneSkill = this.removeOneSkill.bind(this);

    this.state = {
      editingIndex: null,
      name: '',
      description: '',
      skills: [],
      skillTemp: '',
      resources: [],
      formErrors: {},
      formErrorsResources: {},
    };
  }

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

  removeAll() {
    this.setState({
      resources: [],
      formErrors: {},
      formErrorsResources: {},
    });
  }

  testForValidURL() {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const url = content.match(urlRegex);

    var title = (/<title>(.*?)<\/title>/m).exec(response)[1];
  }

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
    })

    if (!formErrors & !isResourceError) {
      this.handleSubmit(input);
      this.setState({
        formErrorsResources: {},
        formErrors: {},
      });
    } else {
      this.setState({
        formErrorsResources: addResourcesErrors,
        formErrors: formErrors,
      });
    }
  }

  handleSubmit(input) {
    const pathToAdd = { ...input };
    const { history } = this.props;
    const existingPath = this.props.path && this.props.path._id;
    const methodToCall = existingPath ? 'learningPaths.update' : 'learningPaths.insert';

    if (existingPath) pathToAdd._id = existingPath;

    Meteor.call(methodToCall, input, (error, documentId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingDocument ? 'Document updated!' : 'Document added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/documents/${documentId}`);
      }
    });
  }

  getPageData = debounce(function (index, field) {
    const urlInput = this.state.resources[index][field];
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    const url = urlInput.match(urlRegex);

    if (url) {
      Meteor.call('utility.remoteGet', url[0], (err, response) => {
        if (err) {
          console.error(err);
          this.setState({
            loadingSite: false,
          });
        } else {
          const titleGet = (/<title(.*?)>(.*?)<\/title>/m).exec(response.content);
          const title = (titleGet) ? titleGet[2] : null;

          const images = [];

          const regExes = [
            ['png', /(content="([^"><]*?).png(\?[^"><]*?)?")|(src="([^"><]*?).png(\?[^"><]*?)?")/gim],
            ['jpg', /(content="([^"><]*?).jpg(\?[^"><]*?)?")|(src="([^"><]*?).jpg(\?[^"><]*?)?")/gim],
            ['gif', /(content="([^"><]*?).gif(\?[^"><]*?)?")|(src="([^"><]*?).gif(\?[^"><]*?)?")/gim],
          ]

          regExes.forEach((regEx) => {
            for (let i = 1; i < 3; i += 1) {
              const logoImg = (regEx[1]).exec(response.content);
              if (logoImg === null) break;
              const whichImg = (logoImg[2]) ? logoImg[2] : logoImg[5];
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
          if (images[0]) toUpdate[index].thumbnail = images[0];
          if (title) {
            var parser = new DOMParser;
            var dom = parser.parseFromString(
                '<!doctype html><body>' + title,
                'text/html');
            var decodedString = dom.body.textContent;

            toUpdate[index].title = decodedString;
          }

          this.setState({
            resources: [...toUpdate],
            loadingSite: false,
          });
        }
      })
    } else {
      this.setState({
        loadingSite: false,
      });
    }

  }, 700)

  handlePathFieldChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  handleFieldChange(e, index, field) {
    // Change resources
    const toUpdate = [...this.state.resources];
    toUpdate[index][field] = e.target.value;

    this.setState({
      resources: [...toUpdate],
    });

    if (field === 'url') {
      this.getPageData(index, field)
      this.setState({
        loadingSite: true,
      })
    }
  }

  addNewResource() {
    const newResourceState = [...this.state.resources];
    const newResource = {
      _id: Random.id(),
      title: 'Title of Resource',
      description: 'Add description here',
      url: 'http://www.example.com',
      thumbnail: '',
    };

    newResourceState.push(newResource);

    this.setState({
      resources: [...newResourceState],
    });
  }

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

  addSkill() {
    const addSkills = [...this.state.skills];

    if (this.state.skillTemp && !addSkills.includes(this.state.skillTemp)) {
      addSkills.push(this.state.skillTemp);
    }

    this.setState({
      skillTemp: '',
      skills: [...addSkills],
    })
  }

  clearSkills() {
    this.setState({
      skills: [],
    })
  }

  removeOneSkill(index) {
    return () => {
      const toRemove = [...this.state.skills];
      toRemove.splice(index, 1);
      this.setState({
        skills: [...toRemove],
      })
    }
  }

  render() {
    const { path } = this.props;
    return (
      <div>
        <div>
          <TextField
            value={this.state.title}
            floatingLabelText="Learning Path Title"
            onChange={e => this.handlePathFieldChange(e, 'title')}
            errorText={(this.state.formErrors && this.state.formErrors.title) ? this.state.formErrors.title : ''}
          />
          <TextField
            multiLine
            rows={6}
            rowsMax={6}
            style={{ width: 300 }}
            value={this.state.description}
            floatingLabelText="Description"
            onChange={e => this.handlePathFieldChange(e, 'description')}
            errorText={(this.state.formErrors && this.state.formErrors.title) ? this.state.formErrors.title : ''}
          />
          <div>
          </div>
          <TextField
            value={this.state.skillTemp}
            floatingLabelText="Skills"
            onChange={e => this.handlePathFieldChange(e, 'skillTemp')}
            errorText={(this.state.formErrors && this.state.formErrors.title) ? this.state.formErrors.title : ''}
          />
          <FontIcon
            color='rgba(0,0,0,0.3)'
            hoverColor='rgba(0,0,0,0.7)'
            className="material-icons pointer"
            onClick={this.addSkill}
          >
            add
          </FontIcon>
          <FontIcon
            color='rgba(0,0,0,0.3)'
            hoverColor='rgba(0,0,0,0.7)'
            className="material-icons pointer"
            onClick={this.clearSkills}
          >
            clear
          </FontIcon>
        </div>
        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {this.state.skills.map((skillItem, index) => (
            <Chip
              style={{ margin: 5 }}
              key={skillItem}
              onRequestDelete={this.removeOneSkill(index)}
            >
              {skillItem}
            </Chip>
          ))}
        </div>
        <div>
        <RaisedButton
          style={{ margin: 6 }}
          onClick={this.addNewResource}
        >
          + Add New
        </RaisedButton>
        <RaisedButton
          style={{ margin: 10 }}
          onClick={this.removeAll}
        >
          Clear All
        </RaisedButton>
        <RaisedButton
          style={{ margin: 10 }}
          onClick={this.formValidate}
        >
          Submit
        </RaisedButton>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="resources">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className="drag-container"
              >
                <div
                  className={(snapshot.isDraggingOver) ? "innerDroppable-hover" : "innerDroppable"}
                  style={{ height: (this.state.resources.length * 80), paddingBottom: 400 }}
                >
                  {this.state.resources.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id}>
                      {(provided, snapshot) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={getItemStyle(
                              provided.draggableStyle,
                              snapshot.isDragging,
                            )}
                            className="droppedComponents"
                            {...provided.dragHandleProps}
                          >
                            <div className="titleBox">
                              <div className="titleBoxLeft">
                                <FontIcon
                                  className="material-icons pointer"
                                  color="rgba(0,0,0,0.2)"
                                  style={{ marginRight: 10 }}
                                >
                                  drag_handle
                                </FontIcon>
                                <h4
                                  style={{
                                    marginRight: 10,
                                    width: 30,
                                    flex: '0 0 auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {`${index + 1}`}
                                </h4>
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
                                <h4
                                  style={{ marginRight: 15 }}
                                >
                                  {item.title}
                                </h4>
                              </div>
                              <div className="titleBoxButton">
                                <Chip
                                  style={{ marginRight: 5 }}
                                >
                                  {item.url.substring(0,45)}
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
                                <div className="titleBoxButton">
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
                              <div className="titleBoxButton">
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
                                  rows={6}
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
                          {provided.placeholder}
                        </div>
                        )}
                    </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
              )}
          </Droppable>


          {/* TODO

              Analagous to DocumentEditor component.

              Form To Add OR Edit Paths

              Editing learning Path Name, description etc.

              And all Resources within that learning path.

              IF EDITING A DOC:

                Doc will be passed in to component.

                Current learning path resources are passed in as an array of objects.

                Form fields are created for each one, default values loaded into forms.

                a forEach function creates a form field for each of these, editable.

              IF CREATING NEW DOC

                Doc will NOT be passed in to component.

                Start by adding resource #1

                + button to add a new Resource

              Form validation to make sure everything is correct.

              Calls Meteor method to Add OR Update Learning Path in collection.

            */}
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
