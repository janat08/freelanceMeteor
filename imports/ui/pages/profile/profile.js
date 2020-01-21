import { Meteor } from 'meteor/meteor';
import './profile.html';
import { Users } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.profile.onCreated(function() {
  Meteor.subscribe('users.all');
});

Template.profile.helpers({
  profile() {
    return Users.findOne(FlowRouter.getParam('id'))
  },
  edit() {
    return Meteor.userId() == FlowRouter.getParam('id')
  },
});

Template.profile.events({
      'submit .profile' (event) {
    event.preventDefault()
    // console.log(event.target.)
    const {
      username: { value: username },
      fullName: { value: fullName },
      intro: { value: intro },
      description: { value: description },
      portfolio: { value: portfolio },
    } = event.target;
    Meteor.call('users.save', {username, fullName, intro, description, portfolio})
  },
});
