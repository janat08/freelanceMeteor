// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Users } from '../cols.js';

Meteor.methods({
  'users.save' (info) {
    Users.update(this.userId, {$set: info})
  },
});
