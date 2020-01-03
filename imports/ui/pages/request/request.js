import { Meteor } from 'meteor/meteor';
import { Milestones } from '/imports/api/cols.js'
import './request.html';

Template.request.onCreated(function() {
  Meteor.subscribe('milestones.all');
});

Template.request.helpers({
  milestones(status) {
    return Milestones.find({recepient: Meteor.userId(), status})
  },
});

Template.request.events({
  'submit #requestMilestoneJs' (event) {
    event.preventDefault();
    const {
      title: { value: tV },
      price: { value: pV }
    } = event.target;

    Meteor.call('milestone.request', {title: tV, price: pV, projectId: 123}, (error) => {
      if (error) {
        alert(error.error);
      }
      else {
        title.value = '';
        url.value = '';
      }
    });
  },
});
