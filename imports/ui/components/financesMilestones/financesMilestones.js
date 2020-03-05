import { Meteor } from 'meteor/meteor';
import { Milestones } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import './financesMilestones.html';

Template.financesMilestones.onCreated(function() {
  Meteor.subscribe('milestones.all');
});

Template.financesMilestones.helpers({

});

Template.financesMilestones.events({
  'click .createJs' (event, templ) {
    Meteor.call('milestones.create', this)
  },
  'click .releaseRequestJs' (event, templ) {
    Meteor.call('milestones.releaseRequest', this)
  },
  'click .releaseJs' (event, templ) {
    console.log('financesMilestones')
    Meteor.call('milestones.release', this)
  },
  'click .cancelJs' (event, templ) {
    Meteor.call('milestones.cancel', this)
  },
});
