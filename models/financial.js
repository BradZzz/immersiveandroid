var mongoose = require('mongoose')

var financeSchema = new mongoose.Schema({
 exchange:   { type: String, required: true },
 symbol:     { type: String, required: true, index: true },
 name:       { type: String, required: true },
 sector:     { type: String },
 industry:   { type: String },
 created:    { type: Date, default: Date.now },
 __v:        { type: Number, select: false },
})

//methods ======================
module.exports = mongoose.model('finance', financeSchema)
