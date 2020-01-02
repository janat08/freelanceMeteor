import { Meteor } from 'meteor/meteor';
import './request.html';

Template.request.onCreated(function() {
  Meteor.subscribe('milestones.all');
});

Template.request.helpers({
  links() {
    return
  },
});

Template.request.events({
  'submit #createMilestoneJs' (event) {
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
