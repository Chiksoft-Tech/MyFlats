'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Association Schema
 */
var AssociationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Association name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Association', AssociationSchema);
