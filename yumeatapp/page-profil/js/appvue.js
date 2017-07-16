var config = {
    apiKey: "AIzaSyBx5UUhgfcRXXd_NDy_8cgbs5hzKXWILNQ",
    authDomain: "yumeat-98b45.firebaseapp.com",
    databaseURL: "https://yumeat-98b45.firebaseio.com",
    projectId: "yumeat-98b45",
    storageBucket: "yumeat-98b45.appspot.com",
    messagingSenderId: "773340535737"
};

firebase.initializeApp(config);

let offres = firebase.database().ref('offres');
let users = firebase.database().ref('users');


var o = new Vue({
    el: "#app",
    firebase: {
        // can bind to either a direct Firebase reference or a query
        offres: offres,
        users : users
    },
    data:{
        city : '',
        searchResult:'',
        isCheckedSleep : false,
        message: ""
    },
    methods:{
        search : function () {
            var searchRequest = $("#search").val();
            var true_searchRequest = searchRequest.split(',');
            true_searchRequest  = true_searchRequest[0].toLowerCase();
            this.searchResult = true_searchRequest;
            console.log(true_searchRequest);
        },

        checkSleep : function(){
            if($("#sleep").is(':checked')){
                this.isCheckedSleep = true;
                console.log(this.isCheckedSleep);
            }
            else{
                this.isCheckedSleep = false;
                console.log(this.isCheckedSleep);
            }
        },
    }
});
