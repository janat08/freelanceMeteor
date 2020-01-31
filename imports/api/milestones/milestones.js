// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Milestones, Projects, Users, Accounts } from '../cols.js';

Meteor.methods({
  'milestones.request' ({ title, price, projectId }) {
    const _id = Milestones.insert({ title, price: price * 1, projectId, requested: true, })
    const proj = Projects.findOne(projectId)
    if (proj.boss == this.userId) {
      Meteor.call('milestones.create', { _id })
    }
    return _id
  },
  'milestones.create': async function({ _id }) {
    const milestone = Milestones.findOne(_id)
    const proj = Projects.findOne(milestone.projectId)
    const boss = Users.findOne(proj.boss)
    const account = Accounts.findOne(boss.accountId)
    if (milestone.created) throw new Meteor.Error('already created')
    if (account.balance < milestone.price) throw new Meteor.Error('not enough money in your account')
    if (this.userId != proj.boss) throw new Meteor.Error('not the boss')
    const escrow = Accounts.findOne({ userId: 'escrow' })
    const res = await Meteor.call("transactions.create", {
      sourceId: account._id,
      destinationId: escrow._id,
      amount: milestone.price,
      title: 'milestone',
      type: 'milestone create'
    })
    console.log(123, res)
    if (res == 'success') {
      Milestones.update(_id, { $set: { created: true, requested: false } })
    }
    else {
      return res
    }
  },
  'milestones.cancel' ({ _id }) {
    const milestone = Milestones.findOne(_id)
    if (milestone.requested != true) {
      const proj = Projects.findOne(milestone.projectId)
      const boss = Users.findOne(proj.boss)
      const account = Accounts.findOne(boss.accountId)
      const escrow = Accounts.findOne({ userId: 'escrow' })
      const res = Meteor.call("transactions.create", {
        sourceId: escrow._id,
        destinationId: account._id,
        amount: milestone.price,
        title: 'milestone',
        type: 'milestone'
      })
      if (res == 'success') {
        Milestones.update(_id, { $set: { canceled: true, created: false, releaseRequested: false, requested: false } })
      }
      else {
        return res
      }
    } else {
      Milestones.update(_id, { $set: { canceled: true, created: false, releaseRequested: false, requested: false } })
    }

  },
  'milestones.releaseRequest' ({ _id }) {
    Milestones.update(_id, { $set: { created: false, releaseRequested: true, } })
  },
  'milestones.release' ({ _id }) {
    const milestone = Milestones.findOne(_id)
    const proj = Projects.findOne(milestone.projectId)
    const worker = Users.findOne(proj.winner.userId)
    const account = Accounts.findOne(worker.accountId)
    const escrow = Accounts.findOne({ userId: 'escrow' })
    const res = Meteor.call("transactions.create", {
      sourceId: escrow._id,
      destinationId: account._id,
      amount: milestone.price,
      title: 'milestone',
      type: 'milestone'
    })
    const res2 = Meteor.call("transactions.create", {
      sourceId: account._id,
      destinationId: escrow._id,
      amount: milestone.price * 0.1,
      title: 'milestone',
      type: 'comission'
    })
    if (res == 'success' && res2 == 'success') {
      Milestones.update(_id, { $set: { released: true, created: false, releaseRequested: false } })
    }
    else {
      return res
    }
  }
});
