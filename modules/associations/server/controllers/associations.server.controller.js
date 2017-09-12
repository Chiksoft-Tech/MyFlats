'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Association = mongoose.model('Association'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Association
 */
exports.create = function(req, res) {
  var association = new Association(req.body);
  association.user = req.user;

  association.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(association);
    }
  });
};

/**
 * Show the current Association
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var association = req.association ? req.association.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  association.isCurrentUserOwner = req.user && association.user && association.user._id.toString() === req.user._id.toString();

  res.jsonp(association);
};

/**
 * Update a Association
 */
exports.update = function(req, res) {
  var association = req.association;

  association = _.extend(association, req.body);

  association.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(association);
    }
  });
};

/**
 * Delete an Association
 */
exports.delete = function(req, res) {
  var association = req.association;

  association.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(association);
    }
  });
};

/**
 * List of Associations
 */
exports.list = function(req, res) {
  Association.find().sort('-created').populate('user', 'displayName').exec(function(err, associations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(associations);
    }
  });
};

/**
 * Association middleware
 */
exports.associationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Association is invalid'
    });
  }

  Association.findById(id).populate('user', 'displayName').exec(function (err, association) {
    if (err) {
      return next(err);
    } else if (!association) {
      return res.status(404).send({
        message: 'No Association with that identifier has been found'
      });
    }
    req.association = association;
    next();
  });
};
