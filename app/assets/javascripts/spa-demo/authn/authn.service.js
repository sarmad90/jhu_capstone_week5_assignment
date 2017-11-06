(function() {
  "use strict";

  angular
    .module("spa-demo.authn")
    .service("spa-demo.authn.Authn", Authn);

  Authn.$inject = ["$auth","$q","spa-demo.authn.whoAmI"];
  function Authn($auth, $q, whoAmI) {
    var service = this;
    service.signup = signup;
    service.user = null;
    service.userImageUrl = null;
    service.isAuthenticated = isAuthenticated;
    service.getCurrentUser = getCurrentUser;
    service.getCurrentUserName = getCurrentUserName;
    service.getCurrentUserId = getCurrentUserId;
    service.getCurrentUserImageUrl = getCurrentUserImageUrl;
    service.login = login;
    service.logout = logout;

    activate();
    return;
    ////////////////
    function activate() {
      $auth.validateUser().then(
        function(user){
          service.user = user;
          service.userImageUrl = null;
          whoAmI.get().$promise.then(function (value) { service.userImageUrl = value.user_image_url; });
          console.log("validated user", user);
        });
    }
    function signup(registration, userImage) {
      var reg = $auth.submitRegistration(registration);
      if (userImage) {
        return reg.then(
          function(response) {
            userImage["user_id"] = response.data.data.id;
            return userImage.$save().then(function() { return response });
          }
        );
      } else {
        return reg;
      }
    }
    function isAuthenticated() {
      return service.user!=null && service.user["uid"]!=null;
    }
    function getCurrentUserName() {
      return service.user!=null ? service.user.name : null;
    }
    function getCurrentUserId() {
      return service.user!=null ? service.user.id : null;
    }
    function getCurrentUserImageUrl() {
      return service.userImageUrl;
    }
    function getCurrentUser() {
      return service.user;
    }
    function login(credentials) {
      console.log("login", credentials.email);
      var result=$auth.submitLogin({
        email: credentials["email"],
        password: credentials["password"]
      });
      var deferred = $q.defer();

      result.then(
        function(response){
          console.log("login complete", response);
          service.user = response;
          service.userImageUrl = null;
          whoAmI.get().$promise.then(function (value) { service.userImageUrl = value.user_image_url; });
          deferred.resolve(response);
        },
        function(response){
          var formatted_errors = { errors: { 
            full_messages: response.errors 
            }
          };
          console.log("login failure", response);            
          deferred.reject(formatted_errors);
        });

      return deferred.promise;
    }

    function logout() {
      console.log("logout");
      var result=$auth.signOut();
      result.then(
        function(response){
          service.user = null;
          service.userImageUrl = null;
          console.log("logout complete", response);
        },
        function(response){
          service.user = null;
          service.userImageUrl = null;
          console.log("logout failure", response);
          alert(response.status + ":" + response.statusText);            
        });
      return result;
    }
  }
})();
