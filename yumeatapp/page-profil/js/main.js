// Initialize Firebase
var config = {
    apiKey: "AIzaSyBx5UUhgfcRXXd_NDy_8cgbs5hzKXWILNQ",
    authDomain: "yumeat-98b45.firebaseapp.com",
    databaseURL: "https://yumeat-98b45.firebaseio.com",
    projectId: "yumeat-98b45",
    storageBucket: "yumeat-98b45.appspot.com",
    messagingSenderId: "773340535737"
};
firebase.initializeApp(config);

var provider_google = new firebase.auth.GoogleAuthProvider();
var provider_facebook = new firebase.auth.FacebookAuthProvider();


//Connexion via google
function googleSignIn() {
    firebase.auth().signInWithPopup(provider_google).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;

        $.ajax({
            url : "js/mail.php", // the resource where youre request will go throw
            type : "PUT", // HTTP verb
            data : {
                email: user.email,
                name: user.displayName
            },
            success: function(result){
                console.log("reussi");
            }
        });

        console.log("test fait");
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
    });
}

//Connexion via facebook
function facebookSignIn(){
    firebase.auth().signInWithPopup(provider_facebook).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        $.ajax({
            url : "js/mail.php", // the resource where youre request will go throw
            type : "PUT", // HTTP verb
            data : {
                email: user.email,
                name: user.displayName
            },
            success: function(result){
                console.log("reussi");
            }
        });

    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

//Si l'utilisateur est connecté ou non
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $("#block-con").html("<div id='thanks'>You have joined us successfully. You are not going to regret it</div>");
    }
});


//Fontion nombre de click
function writeClick(num) {
    firebase.database().ref('click').set({
        nombreClick : num
    });
}

//Fonction d'ajout de click
var nombreClick = firebase.database().ref('click/');
$(".btn-res").on('click',function () {

    nombreClick.once('value').then(function (snapchot){
        let total = snapchot.val().nombreClick;
        parseInt(total);
        console.log(total);

        if(total === undefined){
            writeClick(1);
        }
        else{
            writeClick(total+1);
        }
    })
});

function hidecoockie() {
    document.getElementById('hidethis').setAttribute('style','display:none;');
}
