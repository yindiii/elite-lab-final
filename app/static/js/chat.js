$(function () {
  var INTERVAL = 5000;

  // Object Urls
  var userSelf = '';
  var chatroomID = chatID; // Should be defined via the template 
  var lastMessageID = '';
  var updateLock = false;

  // Backend API URLs
  var createMessageUrl = `/messages/`;
  var refreshMessagesUrl = `/chats/${chatroomID}/updates`;
  var initMessagesUrl = `/chats/${chatroomID}/last`;
  var sessionTokenUrl = `/sessions/`;
  var startSessionUrl = `/session-start/`;

  // jQuery Variables
  var $messages, $messageInput, $logoutButton;
  $messages = $('#message-list');
  $messageInput = $('#message-input');
  $loginSection = $('#login-section');
  $login = $('#login-name');
  $logoutButton = $('#logout-button');
  $copyShareUrlButton = $('#copy-share-url-button');
  $startShareButton = $('#start-share-button');

  // Redirect to url to start session (and provide redirect)
  function redirectToSessionUrl() {
    var redirect = '?redirect=' + window.location.pathname;
    window.location.replace(startSessionUrl + redirect);
  }

  // On submit of a new message (user presses enter or clicks the button)
  $messageInput.on('submit', function (e) {
    e.preventDefault();
    var text = $('input:text').val();
    postMessage(text);
    $('#message-input input:text').val('');
    scrollChatToBottom();
  });

  // User clicks the logout button
  $logoutButton.on('click', function () {
    clearCookie();
    // Redirect back to session create
    redirectToSessionUrl();
  });

  // Hide the button and show the share elements
  $startShareButton.on('click', function () {
    $('#share-row').hide();
    $('#expanded-share-row').show();
    var Url = document.getElementById("share-url");
    Url.value = window.location.href;
  });

  // Browsers only allow auto copy from text inputs
  // Ensure that the text input value is the URL and copy to 
  // user's clipboard
  $copyShareUrlButton.on('click', function () {
    var Url = document.getElementById("share-url");
    Url.value = window.location.href;
    Url.select();
    document.execCommand("copy");
  });

  // Force the chat window box to scroll to the bottom
  function scrollChatToBottom() {
    $("#chat-window").animate({
      scrollTop: $('#chat-window').prop("scrollHeight")
    }, 1000);
  }

  // Create new message in this chatroom in backend
  function postMessage(text) {
    requestBody = {
      username: userSelf,
      chat_id: chatroomID,
      content: text
    }
    $.ajax({
      type: "POST",
      url: createMessageUrl,
      data: JSON.stringify(requestBody),
      dataType: 'json',
      contentType: "application/json",
      success: function (data) {
        refreshMessages();
      }
    });
  }

  // Poll for new messages
  function refreshMessages() {
    if (updateLock) {
      return
    } else {
      updateLock = true;
      refreshUrl = refreshMessagesUrl + '?ref_id=' + lastMessageID.toString();
      $.ajax({
        type: "GET",
        url: refreshUrl,
        success: function (data) {
          renderMessages(data['messages']);
          updateLock = false;
        },
        error: function () {
          updateLock = false;
        }
      });
    }
  }

  // Check for token in cookies
  function getTokenFromCookie() {
    var token = Cookies.get('elite-chatroom-token');
    // Make sure we standardize null response
    if (!token) {
      return null;
    }
    return token;
  }

  // Clear token from cookies
  function clearCookie() {
    Cookies.remove('elite-chatroom-token');
  }

  // Logic needed to load page and initial messages
  function initPage() {
    var token = getTokenFromCookie();
    if (!token) {
      // If no token, then redirect to create session
      redirectToSessionUrl();
    }
    var urlWithToken = sessionTokenUrl + token + '/username/'
    $.ajax({
      type: "GET",
      url: urlWithToken,
      success: function (data) {
        username = data['username'];
        userSelf = username;
        // Set the login info in header
        $loginSection.show();
        $login.html("Logged in as " + username);
        initMessages();
      },
      error: function () {
        $('#content').replaceWith("<h1>Something Went Wrong</h1>");
      }
    })
  }

  // Load initial messages
  function initMessages() {
    $.ajax({
      type: "GET",
      url: initMessagesUrl,
      success: function (data) {
        if (data['messages'].length == 0) {
          lastMessageID = 0;
        }
        renderMessages(data['messages']);
        scrollChatToBottom();
      }
    });
  }

  // Add HTML to display new messages
  function renderMessages(messages) {
    messages.forEach(function (message) {
      // Check if you sent the message
      if (message['username'] === userSelf) {
        $messages.append(`<li class="own-message"><div class="message-box">${message['content']}</div></li>`);
      } else {
        $messages.append(`<div>${message['username']}</div><li class="participant-message"><div class="message-box">${message['content']}</div></li>`);
      }
      lastMessageID = message['id'];
    });
    // scroll to bottom if there were new messages
    if (messages.length > 0) {
      scrollChatToBottom();
    }
  }

  initPage();

  // Continuously run refreshMessages at a certain interval
  setInterval(refreshMessages, INTERVAL);
});