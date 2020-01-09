// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const Transactions = new Mongo.Collection('transactions');
export const Accounts = new Mongo.Collection('accounts')