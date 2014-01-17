chatStream = new Meteor.Stream('chat');

if (Meteor.isClient) {
  chatStream.on('message', function(text) {
    //run when message sent over 'message' stream.
    Session.set('chatMessage'+Session.get('numberChatMessages').toString(), text);
    Session.set('numberChatMessages', Session.get('numberChatMessages')+1);
  });

  Template.chatWindow.messages = function () {
    //Return list of all messages. Each message is stored as a Session variable (enables auto-reactivity).
    var chatMessages = []
    for (var i = 0; i < Session.get('numberChatMessages'); i ++) {
      chatMessages.push({message: Session.get('chatMessage'+i.toString())});
    };
    return chatMessages;
  }

  Template.chatWindow.events({
    'click #sendMessage': function () {
      var u = document.getElementById('name').value;
      var m = document.getElementById('message').value;
      if (m != "" & u != "") {
        var text = u+': '+m;
        document.getElementById('message').value = "";
        Session.set('chatMessage'+Session.get('numberChatMessages').toString(), text);
        Session.set('numberChatMessages', Session.get('numberChatMessages')+1);
        chatStream.emit('message', text);
      };
    }
  });

  Template.chatWindow.rendered = function () {
    //run when chat window template is (re)rendered. 
    //Scroll to the bottom of the frame.
    $('#recordOfMessages').scrollTop($('#recordOfMessages')[0].scrollHeight);
  };

  Meteor.startup(function () {
    //Run by client when he connects to server.
    Session.set('numberChatMessages', 0);
    chatStream.emit('message', "A new user has entered the chat room.");
  });
}

