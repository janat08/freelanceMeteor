import { Meteor } from 'meteor/meteor';
import { Milestones } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import './financesMilestones.html';

Template.financesMilestones.onCreated(function() {
  Meteor.subscribe('milestones.all');
  console.log(this)
});

Template.financesMilestones.helpers({

});

Template.financesMilestones.events({
  'submit #requestMilestoneJs' (event) {
    event.preventDefault();
    const {
      title: { value: tV },
      price: { value: pV }
    } = event.target;

    Meteor.call('milestones.request', { title: tV, price: pV, projectId: 123 }, (error) => {
      if (error) {
        alert(error.error);
      }
      else {
        event.target.title.value = '';
        event.target.price.value = '';
      }
    });
  },
  'click .createJs' (event, templ) {
    console.log(this)
    Meteor.call('milestones.create', this)
  },
  'click .releaseRequestJs' (event, templ) {
    Meteor.call('milestones.releaseRequest', this)
  },
  'click .releaseJs' (event, templ) {
    Meteor.call('milestones.release', this)
  },  
  'click .cancelJs' (event, templ) {
    Meteor.call('milestones.cancel', this)
  },
});
