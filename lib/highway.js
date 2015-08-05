var amqplib = require('amqplib');
var _ = require('lodash');
module.exports = exports = function(app) {
  app.rabbit = amqplib.connect('amqp://localhost');

  app.rabbit.publish = function(channelName, message) {
    return app.rabbit.then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var q = channelName;
        var ok = ch.assertQueue(q);
        return ok.then(function() {
          var msg = message;
          ch.sendToQueue(q, new Buffer(msg));
          ch.close();
          console.log('send: ' + message);
        });
      });
    });
  };

  app.rabbit.consume = function(channelName, handler) {
    return app.rabbit.then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(channelName);
        ok = ok.then(function() {
          ch.consume(channelName, function(msg) {
            console.log('consume ->>>>>>>', msg.content.toString());
            handler(msg.content.toString(), function(err, cb) {
              if (err) { logger.error(err); };
              ch.ack(msg);
              if (_.isFunction(cb)) {
                cb();
              }
            });
          }, { noAck: false });
        });
      });
    });
  };
};
