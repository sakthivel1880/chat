var Sequelize = require('sequelize');
var dateTime = require('node-datetime');
const {
    base64encode,
    base64decode
} = require('nodejs-base64');

var Chats = require("../models/Chat");
var Learner = require("../models/Learner");
var Faculty = require("../models/Faculty");
var numUsers = 0;

module.exports = function(io) {
io.on('connection', socket => {


  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


    // when the client emits 'new message', this listens and executes
    socket.on('new message', data => {
      // we tell the client to execute 'new message'
      var d =formatAMPM(new Date());
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data.msg,
        senderid : socket.sender_id,
        recieverid : data.receiverid,
        d : d
      });


    var msg = data.msg;
    var sender_id = base64decode(socket.sender_id);
    var receiver_id = base64decode(data.receiverid);
    var dt = dateTime.create();
    var date = dt.format('Y-m-d H:M:S');
    
    Chats.create({
        sender_id: sender_id,
        receiver_id: receiver_id,
        msg: msg,
        created_date: date,
        chater_name: socket.chater
    }).then(function (users) {
        if (users) {
        } else {
            res.status(400).send('Error in insert new record');
        }
    });

    });

    socket.on('private message', data => {
      // we tell the client to execute 'new message'
      var d =formatAMPM(new Date());
      socket.broadcast.emit('private message', {
        username: socket.username,
        message: data.msg,
        senderid : socket.sender_id,
        recieverid : data.receiverid,
        d : d
      });
    var msg = data.msg;
    var sender_id = base64decode(socket.sender_id);
    var receiver_id = base64decode(data.receiverid);
    var dt = dateTime.create();
    var date = dt.format('Y-m-d H:M:S');
    
    Chats.create({
        sender_id: sender_id,
        receiver_id: receiver_id,
        msg: msg,
        created_date: date,
        chater_name: socket.chater
    }).then(function (users) {
        if (users) {
        } else {
            res.status(400).send('Error in insert new record');
        }
    });

    });


    // when the client emits 'add user', this listens and executes
  socket.on('add user', main => {
    // we store the username in the socket session for this client
    socket.username = main.username;
    socket.sender_id=main.sender_id;
    socket.chater=main.chater;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      username : socket.username
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      sender: socket.sender_id,
      chater : socket.chater,
      numUsers: numUsers
    });

    if(socket.chater == "1"){
      var id= base64decode(socket.sender_id);
      Faculty.update(
        { active_status: 1 } /* set attributes' value */, 
        { where: { faculty_id_pk : id }} /* where criteria */
  ).then(function(affectedRows) {
});
} else{
  var id= base64decode(socket.sender_id);
        Learner.update(
        { active_status: 1 } /* set attributes' value */, 
        { where: { learner_id_pk : id }} /* where criteria */
  ).then(function(affectedRows) {
});
}

  });
  
     // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });


  socket.on('end', function() {
    if(socket.chater == "1"){
      var id= base64decode(socket.sender_id);
      Faculty.update(
        { active_status: 0 } /* set attributes' value */, 
        { where: { faculty_id_pk : id }} /* where criteria */
  ).then(function(affectedRows) {
  });
  } else{
    var id= base64decode(socket.sender_id);
          Learner.update(
          { active_status: 0 } /* set attributes' value */, 
          { where: { learner_id_pk : id }} /* where criteria */
    ).then(function(affectedRows) {
  });
  }
  socket.disconnect();
});

});




};
