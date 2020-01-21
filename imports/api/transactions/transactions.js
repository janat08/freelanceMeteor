// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Transactions, Accounts } from '../cols.js';

Meteor.methods({
  'accounts.create' ({ userId }) {
    return Accounts.insert({ userId, balance: 0, pendingTransactions: [] })
  },
  //type is for stuff like commission, bid promotion, etc designations
  'transactions.create': async function({ sourceId, destinationId, amount, title, type }) {
    amount = amount * 1
    const _id = Transactions.insert({ sourceId, destinationId, title, type, date: new Date(), amount, state: 'pending' })
    //todo: how im suppose to detect things going terrible wrong, and where to start fixing them
    //just comparing accs before and after wont work since concurrent transactions
    //const accs = Accounts.find({ _id: { $in: [sourceId, destinationId] } }, {sort: {_id: 1}}).fetch()
    return await new Promise((resolve, reject) => {
      Accounts.update({
        _id: sourceId,
        pendingTransactions: { $ne: _id },
        balance: { $gte: amount }
      }, {
        $inc: { balance: -amount },
        $push: { pendingTransactions: _id }
      }, function(err1, first) {
        console.log(err1, first)
        if (first == 1 && !err1) {
          return Accounts.update({
            _id: destinationId,
            pendingTransactions: { $ne: _id },
          }, {
            $inc: { balance: amount },
            $push: { pendingTransactions: _id }
          }, function(err2, second) {
            return Transactions.update({ _id: _id }, { $set: { state: "committed" } },
              function(err3, third) {
                if (second != 1 || third != 1 || err3 || err2) {
                  if (third != 1 || err3 && !err2 && second == 1) {
                    Accounts.update({
                      _id: destinationId
                    }, {
                      $inc: { balance: -amount },
                      $pull: { pendingTransactions: _id }
                    })
                  }

                  if (third != 1 || err3) {
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

                makeDone({ sourceId, destinationId, _id })
                console.log('return')
                resolve('success')
              });
          });
        }
        else {
          Transactions.update(_id, { $set: { state: 'cancel' } })
          throw new Meteor.Error('not enough balance')
        }
      })
    });
    //const accs2 = Accounts.find({ _id: { $in: [sourceId, destinationId] } }, {sort: {_id: 1}}).fetch()
    //if (accs.length == 2, accs2.length == 2)  
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
