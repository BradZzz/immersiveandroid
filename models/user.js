var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')

var userSchema = new mongoose.Schema({

  //user fields
  name:     { type: String },
  email:    { type: String, required: true, index: true },
  gender:   { type: String },
  address1: { type: String },
  address2: { type: String },
  city:     { type: String },
  state:    { type: String },
  zip:      { type: Number },

  codeID:   { type: String },
  codeMeta: [{ type: mongoose.Schema.Types.Mixed }],

  attendance: [{ type: mongoose.Schema.Types.Mixed }],
  homework:   [{ type: mongoose.Schema.Types.Mixed }],
  projects:   [{ type: mongoose.Schema.Types.Mixed }],

  //profile fields
  photo:    { type: String, default: 'assets/img/test/test_logged_out.png' },
  background : { type: Number, default: 1 },

  //server fields
  pass:     { type: String, required: true },
  role:     { type: Number, default: 1 },
  token:    { type: String },
  type:     { type: String, required: true },

  created:  { type: Date, default: Date.now },
  __v:      { type: Number, select: false },
})

//methods ======================
//generating a hash
userSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//checking if password is valid
userSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.pass);
}

//return formatted string for client
userSchema.methods.clientUser = function() {
    var returned = JSON.parse(JSON.stringify(this))
    delete returned['token']
    delete returned['pass']
    return returned
}

userSchema.methods.publicUser = function() {
    var returned = JSON.parse(JSON.stringify(this))
    delete returned['token']
    delete returned['pass']
    delete returned['type']
    delete returned['gender']
    delete returned['address1']
    delete returned['address2']
    delete returned['city']
    delete returned['state']
    delete returned['zip']
    delete returned['photo']
    delete returned['background']
    return returned
}

module.exports = mongoose.model('user', userSchema)
