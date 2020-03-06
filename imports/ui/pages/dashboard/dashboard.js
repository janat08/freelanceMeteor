import { Meteor } from 'meteor/meteor';
import './dashboard.html';
import { Projects } from '/imports/api/cols.js'

Template.dashboard.onCreated(function() {
  Meteor.subscribe('projects.all');
  this.priceB = new ReactiveVar()
  this.priceT = new ReactiveVar()
  this.text = new ReactiveVar()
  this.skills = new ReactiveVar()

});

Template.dashboard.helpers({
  projectsBoss() {
    return Projects.find({ boss: Meteor.user()._id }, { sort: { date: -1 } }).fetch()
  },
  projectsWorker() {
    return Projects.find({ 'winner.userId': Meteor.user()._id }, { sort: { date: -1 } }).fetch()
  },
});

Template.dashboard.events({});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
