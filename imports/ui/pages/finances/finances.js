import { Meteor } from 'meteor/meteor';
import { Milestones, Transactions } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';
import './finances.html';
import '../../components/financesMilestones/financesMilestones.js'
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment'

var getNumber = (function() {
  var previous = NaN;
  return function() {
    var min = 0;
    var max = 4 + (!isNaN(previous) ? -1 : 0);
    var value = Math.floor(Math.random() * (max - min + 1)) + min;
    if (value >= previous) {
      value += 1;
    }
    previous = value;
    return value;
  };
})();

Template.finances.onCreated(function() {
  SubsCache.subscribe('milestones.all');
  SubsCache.subscribe('transactions.all')
  SubsCache.subscribe('users.all')

  this.gen = getNumber()
  this.timeS = moment().subtract(3, 'months').toDate()
  this.timeE = new Date()
  this.timeCha = new ReactiveVar(this.get())


  this.direction = new ReactiveVar(true)
  this.costOfSales = new ReactiveVar()
  this.positiveTransactions = new ReactiveVar()
  this.payments = new ReactiveVar()
  this.expenses = new ReactiveVar()
  this.autorun(() => {
    if (SubsCache.ready()) {
      //expenses
      const { timeCha, timeS, timeE } = this
      timeCha.get()
      this.autorun(() => {
        const accountId = Meteor.user().accountId
        this.expenses.set(Transactions.find({ $and: [{date: {$lte: timeE}}, {date: {$gte: timeS}}], sourceId: accountId, $or: [{ type: "membership" }, { type: "commissionEmployer" }] }).fetch())
      })
      //payments
      this.autorun(() => {
        const accountId = Meteor.user().accountId
        this.payments.set(Transactions.find({ $and: [{date: {$lte: timeE}}, {date: {$gte: timeS}}], sourceId: accountId, $or: [{ type: "milestones" }, { type: "other" }] }).fetch())
      })
      //positiveTransactions
      this.autorun(() => {
        const accountId = Meteor.user().accountId
        this.positiveTransactions.set(Transactions.find({ $and: [{date: {$lte: timeE}}, {date: {$gte: timeS}}], destinationId: accountId, $or: [{ type: "milestones" }] }).fetch())
      })
      //costOfSales
      this.autorun(() => {
        const accountId = Meteor.user().accountId
        this.costOfSales.set(Transactions.find({ $and: [{date: {$lte: timeE}}, {date: {$gte: timeS}}], sourceId: accountId, $or: [{ type: "commissionEmployee" }, { type: "bid promotion" }] }).fetch())
      })
    }
  })
});

Template.finances.helpers({
  milestones() {
    const query = {}
    const incoming = Milestones.find(query, { limit: 20 }).fetch()
    const incomingCount = Milestones.find(query).count()
    //todo: differentiate incoming/outgoing through projectId
    const ins = Template.instance()
    const dir = ins.direction.get()
    const result = {
      incoming: {
        active: dir,
        mapped: incoming.map(mapMilestones),
        count: incomingCount
      },
      outgoing: {
        active: !dir,
        mapped: incoming.map(mapMilestones),
        count: incomingCount
      }
    }
    return result
  },
  costOfSales() {
    return Template.instance().costOfSales.get()
  },
  positiveTransactions() {
    return Template.instance().positiveTransactions.get()
  },
  payments() {
    return Template.instance().payments.get()
  },
  expenses() {
    return Template.instance().expenses.get()
  },
  totalExpenses() {
    const { payments, expenses } = Template.instance()
    return payments.get().concat(expenses.get()).reduce((a, x) => {
      return a + x.amount
    }, 0)
  },
  totalProfit() {
    const { positiveTransactions, costOfSales } = Template.instance()
    return positiveTransactions.get().concat(costOfSales.get().map(x => x.amount * -1)).reduce((a, x) => {
      return a + x.amount
    }, 0)
  }
});

function mapMilestones(x) {
  //todo: look for project, and bossid, to determine if can approve
  x.isBoss = Math.random() >= 0.5

  if (x.releaseRequested) {
    x.status = "releaseRequested"
    x.actions = []
  }
  else if (x.requested) {
    x.status = "requested"
  }
  else if (x.created) {
    x.status = "created"
  }
  else if (x.released) {
    x.status = "released"
  }
  return x
}

Template.finances.events({
  'click .outgoingJs' (e, t) {
    t.direction.set(false)
  },
  'click .incomingJs' (e, t) {
    t.direction.set(true)
  },
  'change .picker' (ev, templ) {
    templ.selected = ev.target.value
    templ.timeCha.set(templ.gen())
  },
  'change .pickerEnd' (ev, templ) {
    templ.selected = ev.target.value
    templ.timeCha.set(templ.gen())
  },
});



Template.finances.onRendered(function() {
  const instance = this
  flatpickr(instance.find('.picker'), { defaultDate: this.timeS });
  flatpickr(instance.find('.pickerEnd'), { defaultDate: this.timeE });
})
