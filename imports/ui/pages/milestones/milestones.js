import { Meteor } from 'meteor/meteor';
import { Milestones } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import './milestones.html';

Template.milestones.onCreated(function() {
  Meteor.subscribe('milestones.all');
});

Template.milestones.helpers({
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

Template.milestones.events({
  'submit #requestMilestoneJs' (event) {
    event.preventDefault();
    const {
      title: { value: tV },
      price: { value: pV }
    } = event.target;

    Meteor.call('milestones.request', {title: tV, price: pV, projectId: 123}, (error) => {
      if (error) {
        alert(error.error);
      }
      else {
        event.target.title.value = '';
        event.target.price.value = '';
      }
    });
  },
  'click .createJs' (event, templ){
    console.log(this)
    Meteor.call('milestones.create', this)
  },
  'click .releaseRequestJs' (event, templ){
    Meteor.call('milestones.releaseRequest', this)
  },
  'click .releaseJs' (event, templ){
    Meteor.call('milestones.release', this)
  },
});
