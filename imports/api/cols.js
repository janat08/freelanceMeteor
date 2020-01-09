import { Milestones, } from './milestones/collection.js'
import { Mail } from './mail/collection.js'
import { Transactions, Accounts } from './transactions/collection.js'

const Users = Meteor.users

export { Milestones, Mail, Users, Transactions, Accounts}