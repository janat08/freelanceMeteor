import { Meteor } from 'meteor/meteor';
import './project.html';
import { Projects, Users } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import '../milestones/milestones.js'

Template.project.onCreated(function() {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all')
});

Template.project.helpers({
  project() {
    let res = Projects.findOne(FlowRouter.getParam('id'))
    if (res.boss == Meteor.userId()) {
      res.isViewedByBoss = true
    }
    res.bids.map(x => {
      x.acceptable = x.userId == Meteor.userId() && x.invited && !x.won
      x.username = Users.findOne({ _id: x.userId }).username
      return x
    })
    return res
  },
  yourBid() {
    let res = Projects.findOne(FlowRouter.getParam('id'))
    res.bids.filter(x=>x.userId == Meteor.userId()).map(x => {
      x.acceptable = x.userId == Meteor.userId() && x.invited && !x.won
      x.username = Users.findOne({ _id: x.userId }).username
      return x
    })
    return res
  }
});

Template.project.events({
  'submit .bidJs' (event) {
    event.preventDefault()
    const { description: { value: description }, price: { value: price } } = event.target
    Meteor.call('projects.bid', { description, price, _id: FlowRouter.getParam('id') })
  },
  'click .inviteJs' (event) {
    Meteor.call('projects.invite', { _id: FlowRouter.getParam('id'), userId: this.userId })
  },
  'click .acceptJs' (event) {
    Meteor.call('projects.accept', { _id: FlowRouter.getParam('id'), userId: this.userId })
  },
});
