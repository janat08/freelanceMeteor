// Import server startup through a single index entry point
import './register-api.js';
import './user.js'
import './fixtures.js';


Meteor.call('accounts.create', {userId: 'escrow'}) 