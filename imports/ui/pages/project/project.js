import { Meteor } from 'meteor/meteor';
import './project.html';
import { Projects, Users, Milestones } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import '../milestones/milestones.js'

Template.project.onCreated(function() {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all')
  Meteor.subscribe('milestones.all')
  this.milestones = []
  this.milestonesChange = new ReactiveVar(true)
  // this.autorun(()=>{
  //   console.log(Meteor.userId(), Milestones.find({userId: Meteor.userId(), projectId: FlowRouter.getParam('id') }).fetch())
  // })
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
    if (Meteor.userId() == res.boss || res.bids.length == 0) return null
    return res.bids.filter(x => x.userId == Meteor.userId()).map(x => {
      x.acceptable = x.userId == Meteor.userId() && x.invited && !x.won
      x.username = Users.findOne({ _id: x.userId }).username
      return x
    })[0]
  },
  milestonesBidding() {
    Template.instance().milestonesChange.get()
    return Template.instance().milestones
  }
});

Template.project.events({
  'click .openMilestonesJs'(e,t){
    alert(
      Milestones.find({userId: this.userId, projectId: FlowRouter.getParam('id') }).fetch()
      .reduce((a,x)=>{
        return a + "  "+ x.title + " " + x.price
      }, "")
      )
  },
  'click .deleteJs' (event, t) {
    t.milestones.splice(this.ind, 1)
    t.milestones.map((x,i)=>{
      x.ind = i
      return x
    })
    t.milestonesChange.set(!t.milestonesChange.get())
  },
  'submit .milestoneJs' (event, t) {
    event.preventDefault()
    const {
      title: {
        value: title
      },
      price: { value: price }
    } = event.target

    t.milestones.push({ price, title, ind: t.milestones.length })
    t.milestonesChange.set(!t.milestonesChange.get())
  },
  'submit .bidJs' (event, t) {
    event.preventDefault()
    const {
      description: {
        value: description
      },
    } = event.target
    //todo
    t.milestones.forEach(x => {
      delete x.ind
      Meteor.call('milestones.request', Object.assign(x, { bidding: true, projectId: FlowRouter.getParam('id') }))
    })
    const price = t.milestones.reduce((a, x)=>{
      return a + x.price*1
    }, 0)
    Meteor.call('projects.bid', { description, price, _id: FlowRouter.getParam('id') })
  },
  'click .inviteJs' (event) {
    Meteor.call('projects.invite', { _id: FlowRouter.getParam('id'), userId: this.userId })
  },
  'click .acceptJs' (event) {
    Meteor.call('projects.accept', { _id: FlowRouter.getParam('id'), userId: this.userId })
  },
});
