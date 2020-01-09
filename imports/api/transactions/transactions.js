// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Transactions, Accounts } from '../cols.js';

Meteor.methods({
  'accounts.create' ({ userId }) {
    return Accounts.insert({ userId, balance: 0, pendingTransactions: [] })
  },
  'transactions.create' ({ sourceId, destinationId, amount, title }) {
    const _id = Transactions.insert({ sourceId, destinationId, title, amount, state: 'pending' })

    const first = Accounts.update({
      sourceId,
      pendingTransactions: { $ne: _id },
      balance: { $gte: amount }
    }, {
      $inc: { balance: -amount },
      $push: { pendingTransactions: _id }
    });

    if (first == 1) {
      const second = Accounts.update({
        destinationId,
        pendingTransactions: { $ne: _id },
      }, {
        $inc: { balance: amount },
        $push: { pendingTransactions: _id }
      });

      const third = Transactions.update({ _id: _id }, { $set: { state: "committed" } });

      if (second != 1 || third != 1) {
        if (second == 1) {
          Accounts.update({
            destinationId
          }, {
            $inc: { balance: -amount },
            $pull: { pendingTransactions: _id }
          })
        }

        if (third != 1) {
          Transactions.update(_id, { $set: { state: 'cancel' } })
        }

        Accounts.update({
          sourceId
        }, {
          $inc: { balance: amount },
          $pull: { pendingTransactions: _id }
        })

        throw Meteor.Error('destination account is missing')
      }

      makeDone({sourceId, destinationId, _id})
    }
    else {
      Transactions.update(_id, { $set: { state: 'cancel' } })
      throw new Meteor.Error('not enough balance')
    }

  },
});

function makeDone({ sourceId, destinationId, _id }) {
  if (sourceId) {
    var a = Accounts.update({ _id: sourceId }, { $pull: { pendingTransactions: _id } });
    if (a != 1) {
      makeDone({ sourceId })
    }
  }
  if (destinationId) {
    var b = Accounts.update({ _id: destinationId }, { $pull: { pendingTransactions: _id } });
    if (b != 1) {
      makeDone({ destinationId })
    }
  }
  if (_id) {
    var c = Transactions.update({ _id: _id }, { $set: { state: "done", date: new Date() } });
    if (c != 1) {
      makeDone({ _id })
    }
  }
}

function nonFailureBalance(amount, id, transId) {
  Accounts.update({
    id
  }, {
    $inc: { balance: id },
    $pull: { pendingTransactions: transId }
  }, (err, res) => {
    if (res == 0 || err) {
      nonFailureBalance(amount, id, transId)
    }
  })

}
