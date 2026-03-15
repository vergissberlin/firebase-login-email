(function() {
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
   * @link    https://firebase.google.com/docs/auth/web/password-auth
   * @param   {*} app Firebase app instance
   * @param   {*} data Authentication object with email and password
   * @param   {*} callback Callback function
   */
  var FirebaseLoginEmail;

  FirebaseLoginEmail = class FirebaseLoginEmail {
    constructor(app = {}, data = {}, callback = {}) {
      // Validation
      if (typeof data.email !== "string") {
        throw new Error("Data object must have an \"email\" field!");
      }
      if (typeof data.password !== "string") {
        throw new Error("Data object must have an \"password\" field!");
      }
      app.auth().signInWithEmailAndPassword(data.email, data.password).then(function(userCredential) {
        return callback(null, userCredential.user);
      }).catch(function(error) {
        switch (error.code) {
          case "auth/invalid-email":
            error = new Error("The specified user account email is invalid.");
            break;
          case "auth/wrong-password":
            error = new Error("The specified user account password is incorrect.");
            break;
          case "auth/user-not-found":
            error = new Error("The specified user account does not exist.");
            break;
          default:
            error = new Error("Error logging user in: " + error.toString());
        }
        return callback(error, null);
      });
    }

  };

  module.exports = FirebaseLoginEmail;

}).call(this);
