// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Users } from '../cols.js';

Meteor.methods({
  'mail.create'({recepients}){
    const users = Users.find({_id: {$in: recepients}}).fetch()
    
    users.forEach(x=>{
      
    })
  },
  'mail.sent'({text}){
    HTTP.call('GET')
  }
});
