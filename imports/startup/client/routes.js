import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '/imports/ui/layouts/body/body.js';
import '/imports/ui/pages/milestones/milestones.js';
import '/imports/ui/pages/finances/finances.js';
import '/imports/ui/pages/info/info.js';
import '/imports/ui/pages/not-found/not-found.js';
import '/imports/ui/pages/transHistory/transHistory.js'
import '/imports/ui/pages/createProject/createProject.js'
import '/imports/ui/pages/browseProjects/browseProjects.js'
import '/imports/ui/pages/project/project.js'
import '/imports/ui/pages/profile/profile.js'

window.SubsCache = new SubsCache(5, 10);

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'info' });
  },
});

FlowRouter.route('/milestones/:projectId', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'milestones' });
  },
});

FlowRouter.route('/finances', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'finances' });
  },
});

FlowRouter.route('/transactions', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'transHistory' });
  },
});

FlowRouter.route('/project/:id', {
  name: 'App.project',
  action() {
    BlazeLayout.render('App_body', { main: 'project' });
  },
});

FlowRouter.route('/projects', {
  name: 'App.projects',
  action() {
    BlazeLayout.render('App_body', { main: 'browseProjects' });
  },
});

FlowRouter.route('/createProject', {
  name: 'App.createProject',
  action() {
    BlazeLayout.render('App_body', { main: 'createProject' });
  },
});

FlowRouter.route('/profile/:id', {
  name: 'App.profile',
  action() {
    BlazeLayout.render('App_body', { main: 'profile' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
