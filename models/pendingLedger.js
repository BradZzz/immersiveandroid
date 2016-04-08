var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')

var pendingLedgerSchema = new mongoose.Schema({

 name:       { type: String },
 sym:        { type: String, required: true, index: true },
 cost:       { type: Number, required: true },
 user:       { type: String, required: true, index: true },
 token:      { type: String, required: true },
 created:    { type: Date, default: Date.now },
 __v:        { type: Number, select: false },

})

//This generates the hashed user id for public storage (secret + id)
pendingLedgerSchema.methods.generateHash = function(hashString) {
 return bcrypt.hashSync(hashString, bcrypt.genSaltSync(8), null)
}

//methods ======================
module.exports = mongoose.model('pendingLedger', pendingLedgerSchema)
