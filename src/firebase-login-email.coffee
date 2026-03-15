###*
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
###
class FirebaseLoginEmail

  constructor: (app = {}, data = {}, callback = {}) ->
    # Validation
    if typeof data.email isnt "string"
      throw new Error "Data object must have an \"email\" field!"
    if typeof data.password isnt "string"
      throw new Error "Data object must have an \"password\" field!"

    app.auth().signInWithEmailAndPassword(data.email, data.password)
    .then (userCredential) ->
      callback null, userCredential.user
    .catch (error) ->
      switch error.code
        when "auth/invalid-email"
          error = new Error "The specified user account email is invalid."
        when "auth/wrong-password"
          error = new Error "The specified user account password is incorrect."
        when "auth/user-not-found"
          error = new Error "The specified user account does not exist."
        else
          error = new Error "Error logging user in: " + error.toString()

      callback error, null

module.exports = FirebaseLoginEmail
