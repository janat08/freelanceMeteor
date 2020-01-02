// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Milestones } from '../cols.js';

Meteor.methods({
  'milestone.request' ({ title, price, projectId }) {
    const _id = Milestones.insert({ title, price, projectId, approved: false })
    //find project, and decide if milestone.create is to be called if userId is boss
  },
  'milestone.create' ({ _id }) {
    //if enough money
    //transfer money
    //check if boss
    Milestones.update(_id, { approved: true })
  }
});
