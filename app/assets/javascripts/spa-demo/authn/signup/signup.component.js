(function() {
  "use strict";

  angular
    .module("spa-demo.authn")
    .component("sdSignup", {
      templateUrl: templateUrl,
      controller: SignupController,
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_signup_html;
  }    

  SignupController.$inject = [  "$scope",
                                "$state",
                                "spa-demo.authn.Authn",
                                "spa-demo.layout.DataUtils",
                                "spa-demo.subjects.Image"];
  function SignupController($scope, $state, Authn, DataUtils, Image) {
    var vm=this;
    vm.signupForm = {};
    vm.userImage = new Image();
    vm.signup = signup;
    vm.setUserImageContent = setUserImageContent;

    vm.$onInit = function() {
      console.log("SignupController",$scope);
    }
    return;
    //////////////
    function signup() {
      console.log("signup...");
      $scope.signup_form.$setPristine();
      Authn.signup(vm.signupForm, vm.userImage).then(
        function(response){
          vm.id = response.data.data.id;
          console.log("signup complete", response.data, vm);
          $state.go("home");
        },
        function(response){
          vm.signupForm["errors"]=response.data.errors;
          console.log("signup failure", response, vm);          
        }
      );
    }

    function setUserImageContent(dataUri) {
      vm.userImage.image_content = DataUtils.getContentFromDataUri(dataUri);
    }
  }
})();