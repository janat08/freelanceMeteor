import { Meteor } from 'meteor/meteor';
import './project.html';
import { Milestones } from '/imports/api/cols.js'

Template.project.onCreated(function () {
  Meteor.subscribe('links.all');
});

Template.project.helpers({
  links() {
  },
});

Template.project.events({
  'submit .info-link-add'(event) {

  },
});
