'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Association = mongoose.model('Association'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  association;

/**
 * Association routes tests
 */
describe('Association CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Association
    user.save(function () {
      association = {
        name: 'Association name'
      };

      done();
    });
  });

  it('should be able to save a Association if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Association
        agent.post('/api/associations')
          .send(association)
          .expect(200)
          .end(function (associationSaveErr, associationSaveRes) {
            // Handle Association save error
            if (associationSaveErr) {
              return done(associationSaveErr);
            }

            // Get a list of Associations
            agent.get('/api/associations')
              .end(function (associationsGetErr, associationsGetRes) {
                // Handle Associations save error
                if (associationsGetErr) {
                  return done(associationsGetErr);
                }

                // Get Associations list
                var associations = associationsGetRes.body;

                // Set assertions
                (associations[0].user._id).should.equal(userId);
                (associations[0].name).should.match('Association name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Association if not logged in', function (done) {
    agent.post('/api/associations')
      .send(association)
      .expect(403)
      .end(function (associationSaveErr, associationSaveRes) {
        // Call the assertion callback
        done(associationSaveErr);
      });
  });

  it('should not be able to save an Association if no name is provided', function (done) {
    // Invalidate name field
    association.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Association
        agent.post('/api/associations')
          .send(association)
          .expect(400)
          .end(function (associationSaveErr, associationSaveRes) {
            // Set message assertion
            (associationSaveRes.body.message).should.match('Please fill Association name');

            // Handle Association save error
            done(associationSaveErr);
          });
      });
  });

  it('should be able to update an Association if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Association
        agent.post('/api/associations')
          .send(association)
          .expect(200)
          .end(function (associationSaveErr, associationSaveRes) {
            // Handle Association save error
            if (associationSaveErr) {
              return done(associationSaveErr);
            }

            // Update Association name
            association.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Association
            agent.put('/api/associations/' + associationSaveRes.body._id)
              .send(association)
              .expect(200)
              .end(function (associationUpdateErr, associationUpdateRes) {
                // Handle Association update error
                if (associationUpdateErr) {
                  return done(associationUpdateErr);
                }

                // Set assertions
                (associationUpdateRes.body._id).should.equal(associationSaveRes.body._id);
                (associationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Associations if not signed in', function (done) {
    // Create new Association model instance
    var associationObj = new Association(association);

    // Save the association
    associationObj.save(function () {
      // Request Associations
      request(app).get('/api/associations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Association if not signed in', function (done) {
    // Create new Association model instance
    var associationObj = new Association(association);

    // Save the Association
    associationObj.save(function () {
      request(app).get('/api/associations/' + associationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', association.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Association with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/associations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Association is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Association which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Association
    request(app).get('/api/associations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Association with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Association if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Association
        agent.post('/api/associations')
          .send(association)
          .expect(200)
          .end(function (associationSaveErr, associationSaveRes) {
            // Handle Association save error
            if (associationSaveErr) {
              return done(associationSaveErr);
            }

            // Delete an existing Association
            agent.delete('/api/associations/' + associationSaveRes.body._id)
              .send(association)
              .expect(200)
              .end(function (associationDeleteErr, associationDeleteRes) {
                // Handle association error error
                if (associationDeleteErr) {
                  return done(associationDeleteErr);
                }

                // Set assertions
                (associationDeleteRes.body._id).should.equal(associationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Association if not signed in', function (done) {
    // Set Association user
    association.user = user;

    // Create new Association model instance
    var associationObj = new Association(association);

    // Save the Association
    associationObj.save(function () {
      // Try deleting Association
      request(app).delete('/api/associations/' + associationObj._id)
        .expect(403)
        .end(function (associationDeleteErr, associationDeleteRes) {
          // Set message assertion
          (associationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Association error error
          done(associationDeleteErr);
        });

    });
  });

  it('should be able to get a single Association that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Association
          agent.post('/api/associations')
            .send(association)
            .expect(200)
            .end(function (associationSaveErr, associationSaveRes) {
              // Handle Association save error
              if (associationSaveErr) {
                return done(associationSaveErr);
              }

              // Set assertions on new Association
              (associationSaveRes.body.name).should.equal(association.name);
              should.exist(associationSaveRes.body.user);
              should.equal(associationSaveRes.body.user._id, orphanId);

              // force the Association to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Association
                    agent.get('/api/associations/' + associationSaveRes.body._id)
                      .expect(200)
                      .end(function (associationInfoErr, associationInfoRes) {
                        // Handle Association error
                        if (associationInfoErr) {
                          return done(associationInfoErr);
                        }

                        // Set assertions
                        (associationInfoRes.body._id).should.equal(associationSaveRes.body._id);
                        (associationInfoRes.body.name).should.equal(association.name);
                        should.equal(associationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Association.remove().exec(done);
    });
  });
});
