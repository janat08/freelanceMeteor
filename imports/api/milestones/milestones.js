// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Milestones } from '../cols.js';

Meteor.methods({
  'milestones.request' ({ title, price, projectId = "1234" }) {
    const _id = Milestones.insert({ title, price, projectId, requested: true, })
    return _id
    //todo: find project, and decide if milestone.create is to be called if userId is boss
  },
  'milestones.create' ({ _id }) {
    //todo: if enough money    
    //check if boss
    //transfer money
    Milestones.update(_id, { $set: { created: true, requested: false } })
  },
  'milestones.releaseRequest' ({ _id }) {
    Milestones.update(_id, { $set: { created: false, releaseRequested: true } })
  },
  'milestones.release' ({ _id }) {
    console.log('releasing')
    Milestones.update(_id, { $set: { released: true, created: false, releaseRequested: false } })
  }
});
