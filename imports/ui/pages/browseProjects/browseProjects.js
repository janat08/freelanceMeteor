import { Meteor } from 'meteor/meteor';
import './browseProjects.html';
import { Projects } from '/imports/api/cols.js'

Template.browseProjects.onCreated(function() {
  Meteor.subscribe('projects.all');
  this.priceB = new ReactiveVar()
  this.priceT = new ReactiveVar()
  this.text = new ReactiveVar()
  this.skills = new ReactiveVar()

});

//include date and sorting

Template.browseProjects.helpers({
  projects() {
    const { text, priceB, priceT, skills } = Template.instance()
    const reg = new RegExp(escapeRegex(text.get() || ""), 'gi')
    const pB = priceB.get()
    const pT = priceT.get()
    const sL = skills.get()
    let query = {}
    if (pT || pB) {
      query.price = {}
    }
    if (pT) {
      query.price.$lte = pT
    }
    if (pB) {
      query.price.$gte = pB
    }
    if (text.get()) {
      query.$or = [{ title: reg }, { description: reg }]
    }
    if (sL){
      query.skills = {$in: sL}
    }
    console.log(query)
    return Projects.find(query, {sort: {date: -1}}).fetch().map(x=>{
      x.date = x.date.toLocaleString()
      return x
    })
  },
});

Template.browseProjects.events({
  'submit .projectFilters' (e, t) {
    e.preventDefault()
    console.log(typeof e.target.upperPrice.value)
    const {
      upperPrice: { value: uP },
      lowerPrice: { value: lP },
      text: { value: text },
      skills: { value: sV },
    } = e.target
    const sVP = sV.split('#').map(x => x.trim()).filter(x => x != '')

    t.priceT.set(uP)
    t.priceB.set(lP)
    t.text.set(text)
    t.skills.set(sVP)
  },
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
