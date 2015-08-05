var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-d648bddaf75f63c695d13d627a1be87d');

module.exports = exports = function(app) {
  var handlerEmail = function(msg, callback) {
    console.log('msg ->>>>', msg);
    try {
      msg = JSON.parse(msg);
    } catch(e)  {
      console.log(e);
      return callback();
    }

    mg.sendText('admin@myblog.com', msg.to,
      '[' + msg.title + '] You have new comment',
      msg.from + ' has commented in your blog: ' + msg.comment,
      'noreply@myblog.com', {},
      function(err) {
        if (err) console.log('Oh noes: ' + err);
        else     console.log('Success');
    });

    return callback();
  };
  app.rabbit.consume('notify:email', handlerEmail);
};