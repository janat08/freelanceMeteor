// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Users } from '../cols.js';
import mailgun from 'mailgun-js'
const KEY = "key-addcac9154e09fa36a6aac8021bf08e6"
const DOMAIN = "sandboxb74894d472784e0f8a12e3ae6f399185.mailgun.org"
const testEmail = "jey.and.key@gmail.com"
// const KEY = process.env.MAILGUN_API_KEY
// const DOMAIN = process.env.MAILGUN_DOMAIN
// const testEmail = "email@grape-develop.dk"

const mg = mailgun({ apiKey: KEY, domain: DOMAIN });

Meteor.methods({
  'mail.create' ({ recepients, body, subject }) {
    const users = Users.find({ _id: { $in: recepients } }).fetch()

    users.forEach(x => {
      Meteor.call('mail.send', {body, subject})
    })
  },
  'mail.send' ( {body= 'asdf', subject = 'asdf', recepient = testEmail} ) {
    this.unblock()
    const data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: recepient,
      subject: subject,
      text: body
    };
    mg.messages().send(data, function(error, body) {
      console.log('response', body, error);
    });
  }
});

Meteor.call('mail.send', {  })
