import {Milestones} from './cols.js'

Meteor.publish('milestones.all', function (){
    return Milestones.find()
})