import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/milestones/milestones.js';
import '../../ui/pages/finances/finances.js';
import '../../ui/pages/info/info.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/transHistory/transHistory.js'
import '../../ui/pages/createProject/createProject.js'
import '../../ui/pages/browseProjects/browseProjects.js'
import '../../ui/pages/project/project.js'
import '../../ui/pages/profile/profile.js'

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
