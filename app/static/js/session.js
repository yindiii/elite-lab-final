$(function () {
  // Backend API URLs
  var baseUrl = window.location.origin;
  var createSessionUrl = baseUrl + "/session/"; // DEFINE HERE

  // jQuery Variables
  var $messages, $messageInput;
  $messages = $('#message-list');
  $usernameInput = $('#username-input');

  $usernameInput.on('submit', function (e) {
    e.preventDefault();
    var text = $('input:text').val();
    createSession(text);
  });

  // We use the Cookies library to set the provided token as a cookie
  function setCookie(token) {
    console.log("Setting token to cookies: " + token);
    Cookies.set(
      'elite-channel-token',
      token, {
        expires: 1 // Expires in 1 day
      });
  }

  function createSession(username) {
    var urlParams = new URLSearchParams(window.location.search);
    var redirectPath = urlParams.get('redirect');

    // Ensure that any falsey value will be an empty string
    if (!redirectPath) {
      redirectPath = '';
    }

    requestBody = {
      username: username
    }; // DEFINE HERE

    $.ajax({
      type: "POST",
      url: createSessionUrl,
      data: JSON.stringify(requestBody),
      dataType: 'json',
      contentType: "application/json",

      // Callback function handling token data
      success: function (data) {
        console.log("Got token: " + data.token);
        // Set a cookie with response data from the request
        setCookie(data.token);
        // Redirect us to the chatroom page, now that we have the session token set
        window.location.replace(baseUrl + redirectPath);
      },

      // Callback function for if the server responds with an error
      error: function () {
        alert("Something went wrong");
      }
    });
  }

});