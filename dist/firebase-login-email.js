
/**
 * FirebaseLoginEmail
 *
 * Authenticating Users with Email & Password
 * Firebase makes it easy to integrate email and password authentication
 * into your app. Firebase automatically stores your users' credentials
 * securely (using bcrypt) and redundantly (daily off-site backups).
 * This separates sensitive user credentials from your application data,
 * and lets you focus on the user interface and experience for your app.
 *
 * @author  André Lademann <vergissberlin@googlemail.com>
 * @link    https://www.firebase.com/docs/web/guide/login/password.html
 * @param   {*} ref Firebase object reference
 * @param   {*} data Authentication object with email and password
 * @param   {*} callback Callback function
 */

(function() {
  var FirebaseLoginEmail;

  FirebaseLoginEmail = (function() {
    function FirebaseLoginEmail(ref, data, callback) {
      if (ref == null) {
        ref = {};
      }
      if (data == null) {
        data = {};
      }
      if (callback == null) {
        callback = {};
      }
      if (typeof data.email !== "string") {
        throw new Error("Data object must have an \"email\" field!");
      }
      if (typeof data.password !== "string") {
        throw new Error("Data object must have an \"password\" field!");
      }
      ref.authWithPassword({
        email: data.email,
        password: data.password
      }, function(error, authData) {
        if (error) {
          switch (error.code) {
            case "INVALID_EMAIL":
              console.error("The specified user account email is invalid.");
              break;
            case "INVALID_PASSWORD":
              console.error("The specified user account password is incorrect.");
              break;
            case "INVALID_USER":
              console.error("The specified user account does not exist.");
              break;
            default:
              console.error("Error logging user in:", error);
          }
          return;
        } else {
          console.info("Firebase authenticated successfully.");
        }
        return callback(error, authData);
      });
    }

    return FirebaseLoginEmail;

  })();

  module.exports = FirebaseLoginEmail;

}).call(this);
