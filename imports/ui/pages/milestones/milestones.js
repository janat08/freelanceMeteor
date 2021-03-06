import { Meteor } from 'meteor/meteor';
import { Milestones, Projects } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import './milestones.html';

Template.milestones.onCreated(function() {
  Meteor.subscribe('milestones.all');
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
  console.log('milestones')
});

Template.milestones.helpers({
  milestones(status) {
    const id = FlowRouter.getParam('id')
    const res = Milestones.find({[status]: true,
      projectId: id, bidding: false
    }).fetch()
    return res.map(x=>{
      x.isBoss = Projects.findOne(id).boss == Meteor.userId()
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

    Meteor.call('milestones.request', {title: tV, price: pV, projectId: FlowRouter.getParam('id')}, (error) => {
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
    Meteor.call('milestones.create', this)
  },
  'click .releaseRequestJs' (event, templ){
    Meteor.call('milestones.releaseRequest', this)
  },
  'click .releaseJs' (event, templ){
    Meteor.call('milestones.release', this)
  },
  'click .cancelJs' (event, templ){
    Meteor.call('milestones.cancel', this)
  },
});
