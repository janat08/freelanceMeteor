import { Meteor } from 'meteor/meteor';
import './browseProjects.html';
import { Milestones } from '/imports/api/cols.js'

Template.browseProjects.onCreated(function () {
  Meteor.subscribe('links.all');
});

Template.browseProjects.helpers({
  links() {
  },
});

Template.browseProjects.events({
  'submit .info-link-add'(event) {

  },
});
