import { Meteor } from 'meteor/meteor';
import './createProject.html';
import { Projects } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.createProject.onCreated(function() {
});

Template.createProject.helpers({
  skills() {
    
  },
});

Template.createProject.events({
  'submit .createProjectJs' (event) {
    event.preventDefault()
    const target = event.target;
    const {
      title: { value: tV },
      description: { value: dV },
      price: { value: pV },
      skills: { value: sV },
    } = target

    const sVP = sV.split('#').map(x=>x.trim()).filter(x=>x!='')

    Meteor.call('projects.create', {
      title: tV,
      description: dV,
      price: pV,
      skills: sVP,
    }, (err, res) => {
      console.log(23)
      if (err) {
        alert(err)
      }
      else {
        FlowRouter.go('App.project', { id: res })
      }
    })
  },
});
