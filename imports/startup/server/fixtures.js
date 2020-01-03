// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Milestones } from '/imports/api/cols.js'
if ((!Milestones.find().count() || !true) && Meteor.isDevelopment) {
    Milestones.remove({})
    for (var a = 0; a < 60; a++) {
        let _id = Meteor.call('milestones.request', { title: 'asdf' + a, price: 123 })
        if (a > 20) {
            Meteor.call('milestones.create', {_id })
        }
        if (a > 40) {
            Meteor.call('milestones.releaseRequest', {_id})
            if (a > 50) {
                Meteor.call('milestones.release', {_id})
            }
        }
    }
}
