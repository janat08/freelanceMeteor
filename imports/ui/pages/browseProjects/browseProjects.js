import { Meteor } from 'meteor/meteor';
import './browseProjects.html';
import { Projects } from '/imports/api/cols.js'

Template.browseProjects.onCreated(function() {
  Meteor.subscribe('projects.all');
  this.priceB = new ReactiveVar()
  this.priceT = new ReactiveVar()
  this.text = new ReactiveVar()

});

//include date and sorting

Template.browseProjects.helpers({
  projects() {
    const { text, priceB, priceT } = Template.instance()
    const reg = new RegExp(escapeRegex(text.get() || ""), 'gi')
    const pB = priceB.get()
    const pT = priceT.get()
    let query = { }
    if (pT||pB){
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
    console.log(query)
    return Projects.find(query)
  },
});

Template.browseProjects.events({
  'submit .projectFilters' (e, t) {
    e.preventDefault()
    console.log(typeof e.target.upperPrice.value)
    const {
      upperPrice: { value: uP },
      lowerPrice: { value: lP },
      text: { value: text }
    } = e.target
    t.priceT.set(uP)
    t.priceB.set(lP)
    t.text.set(text)
  },
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
