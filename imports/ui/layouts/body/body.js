import './body.html';


Template.App_body.helpers({
    userId () {
        return Meteor.userId()
    }
})

Template.App_body.onCreated(()=>{
    Meteor.subscribe('users.all')
})