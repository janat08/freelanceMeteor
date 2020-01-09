import { Meteor } from 'meteor/meteor';
import { Milestones } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import './finances.html';

Template.finances.onCreated(function() {
  Meteor.subscribe('milestones.all');
});

Template.finances.helpers({
  milestones(status) {
    const res = Milestones.find({recepient: Meteor.userId(), [status]: true, 
      projectId: FlowRouter.getParam('projectId')
    }).fetch()
    return res.map(x=>{
      //todo: look for project, and bossid, to determine if can approve
      x.isBoss = Math.random() >= 0.5
      return x
    })
  },
});

Template.finances.events({
  'submit #requestMilestoneJs' (event) {

  },
});
