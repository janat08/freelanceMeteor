import { Meteor } from 'meteor/meteor';
import './transHistory.html';
import { Transactions } from '/imports/api/cols.js'

Template.transHistory.onCreated(function() {
  Meteor.subscribe('transactions.all');
  Meteor.subscribe('users.all');
});

Template.transHistory.helpers({
  transactions() {
    const accountId = Meteor.user().accountId
    return Transactions.find({ $or: [{ sourceId: accountId },{ destinationId: accountId }] })
      .map(x => {
        if (x.sourceId == accountId) {
          x.type = false
        }
        else {
          x.type = true
        }
        return x
      })
  },
});

Template.transHistory.events({
  'submit .info-link-add' (event) {

  },
});
