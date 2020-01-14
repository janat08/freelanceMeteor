import {Milestones, Accounts, Transactions, Users, Projects} from './cols.js'

Meteor.publish('milestones.all', function (){
    return Milestones.find()
})

Meteor.publish('accounts.all', function (){
    return Accounts.find()
})

Meteor.publish('transactions.all', function (){
    return Transactions.find()
})

Meteor.publish('users.all', function (){
    return Users.find()
})

Meteor.publish('projects.all', function(){
    return Projects.find()
})