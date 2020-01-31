// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../cols.js';

Meteor.methods({
  'projects.create' (info) {
    if (!this.userId) throw new Meteor.Error('logged out')
    return Projects.insert({ ...info, bids: [], boss: this.userId, date: new Date() })
  },
  'projects.bid' ({ price, description, milestones, _id }) {
    if (!this.userId) throw new Meteor.Error('logged out')
    if (Projects.findOne(_id).bids.find(x => x.userId == this.userId)) throw new Meteor.Error('already bid')
    return Projects.update(_id, { $push: { bids: { userId: this.userId, price, description, milestones } } })
  },
  'projects.accept' ({ _id, userId }) {
    if (!this.userId) throw new Meteor.Error('logged out')
    const proj = Projects.findOne(_id)
    const bid = proj.bids.find(x => x.userId == this.userId)
    if (!bid) throw new Meteor.Error('hasnt bid')
    if (!bid.invited) throw new Meteor.Error('not invited')
    return Projects.update({_id, "bids.userId": userId}, { $set: { "bids.$.won": true, complete: true, winner: bid, price: bid.price }})
  },
  'projects.invite' ({ userId, _id }) {
    if (!this.userId) throw new Meteor.Error('logged out')
    const proj = Projects.findOne(_id)
    if (proj.boss != this.userId) throw new Meteor.Error('not boss')
    return Projects.update({_id, "bids.userId": userId}, { $set: { "bids.$.invited": true, "bids.$.inviteDate": new Date() } })
  },
});
