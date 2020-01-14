// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../cols.js';

Meteor.methods({
  'projects.create' (info) {
    if (!this.userId) throw new Meteor.Error('logged out')
    return Projects.insert({ ...info, boss: this.userId })
  },
  'projects.bid' ({ price, description, milestones, _id }) {
    if (!this.userId) throw new Meteor.Error('logged out')
    if (Projects.findOne(_id).bids.find(x => x.userId == this.userId)) throw new Meteor.Error('already bid')
    return Projects.update(_id, { $push: { userId: this.userId, price, description, milestones } })
  },
  'projects.accept' ({ _id }) {
    if (!this.userId) throw new Meteor.Error('logged out')
    const proj = Projects.findOne(_id)
    if (!proj.invited.find(x=>x.userId == this.userId)) throw new Meteor.Error('not invited')
    //todo check balance
    return Projects.update(_id, { winner: this.userId })
  },
  'projects.invite' ({ userId, _id }) {
    if (!this.userId) throw new Meteor.Error('logged out')
    const proj = Projects.findOne(_id)
    if (proj.boss != this.userId) throw new Meteor.Error('not boss')
    //todo check balance
    return Projects.update(_id, { $push: {invited: {userId, date: new Date()} } })
  },
});
