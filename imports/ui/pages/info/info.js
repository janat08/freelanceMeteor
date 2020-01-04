import { Meteor } from 'meteor/meteor';
import './info.html';

Template.info.onCreated(function () {
  Meteor.subscribe('links.all');
});

Template.info.helpers({
  links() {
  },
});

Template.info.events({
  'submit .info-link-add'(event) {

  },
});
