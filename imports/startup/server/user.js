Accounts.onCreateUser((options, user) => {
    console.log(user)
  user.accountId = Meteor.call('accounts.create', {userId: user._id})
  return user;
});