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
 * @link    https://www.firebase.com/docs/web/guide/login/password.html
 * @param   {*} ref Firebase object reference
 * @param   {*} data Authentication object with email and password
 * @param   {*} callback Callback function
###
class FirebaseLoginEmail

  constructor: (ref = {}, data = {}, callback = {}) ->
    # Validation
    if typeof data.email isnt "string"
      throw new Error "Data object must have an \"email\" field!"
    if typeof data.password isnt "string"
      throw new Error "Data object must have an \"password\" field!"

    ref.authWithPassword {email: data.email, password: data.password}
    , (error, authData)->
      if error
        switch error.code
          when "INVALID_EMAIL"
            error = "The specified user account email is invalid."
          when "INVALID_PASSWORD"
            error = "The specified user account password is incorrect."
          when "INVALID_USER"
            error = "The specified user account does not exist."
          else
            error = "Error logging user in: " + error.toString()

      callback error, authData

module.exports = FirebaseLoginEmail
