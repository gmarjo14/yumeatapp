(function ($) {
    var s = window.location.href.split('?');
    var offerId = s[1];

    let userId;

    const config = {
        apiKey: "AIzaSyBx5UUhgfcRXXd_NDy_8cgbs5hzKXWILNQ",
        authDomain: "yumeat-98b45.firebaseapp.com",
        databaseURL: "https://yumeat-98b45.firebaseio.com",
        projectId: "yumeat-98b45",
        storageBucket: "yumeat-98b45.appspot.com",
        messagingSenderId: "773340535737"
    };

    const yumeatdb = (firebase.initializeApp(config)).database();

    let offres = yumeatdb.ref('offres');
    let users = yumeatdb.ref('users');

    function length(){
        yumeatdb.ref('offres/'+offerId+'/guests').on('value',function (snap) {
            if(snap.val() == 'undefined'){
                detailsVue.guestsLength = '0';
            }
            else
                detailsVue.guestsLength = ''+snap.val().length;
        });
    }

    length();

    let detailsVue = new Vue({
        el: "#container",
        firebase: function () {
            return {
                offres: yumeatdb.ref('offres'),
                users: yumeatdb.ref('users'),
            }
        },
        data: {
            offerID: offerId,
            guestsLength : "",
            host_uid : '',
            // host_info:''
        },
        beforeMount: function(){
            this.$bindAsArray('offres', yumeatdb.ref('offres').orderByChild('key').equalTo(this.offerID));
        },
        updated:function () {
            firebase.auth().onAuthStateChanged(function(user) {
                if(user){
                    userId = firebase.auth().currentUser.uid;
                    // detailsVue.isUser();
                    // console.log('lol');
                    let newBtn = $("#res_container");
                    let btn = "<a role='button' id='btn-res' class='informormation_list'>Make your reservation</a>"
                    newBtn.html(btn);
                }
                else
                    console.log('no user');
            });
        },
        methods:{
            makeReservation : function () {
                console.log(this.guestsLength);
                let num_guests = this.guestsLength;
                swal({
                        title: "Are you sur?",
                        text: "You are about to reserve this offer",
                        showCancelButton: true,
                        confirmButtonColor: "#1ECD97",
                        confirmButtonText: "Yes, I want to book",
                        cancelButtonText: "No, I want to cancel",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            let thisOffre = yumeatdb.ref('offres/'+offerId);
                            thisOffre.on('value',function (snap) {
                                let guests = snap.val().guests;
                                let num_max = snap.val().num_people;

                                if(guests.indexOf(userId) == -1){
                                    console.log(num_guests);
                                    if( parseInt(num_guests) <= num_max){
                                        if(guests == 'undefined'){
                                            var tab = [];
                                            tab.push(userId);
                                            thisOffre.update({
                                                guests:tab
                                            });
                                        }
                                        swal({
                                            title:"Confirmed !",
                                            text:"You have booked successfully <br> An email will be sent to you with all necessary information. <br> Thank you.",
                                            type:"success",
                                            confirmButtonColor: "#1ECD97",
                                            html:true
                                        });
                                    }
                                    else{
                                        swal({
                                            title:"Error !",
                                            text:"The offer has reached the maximum number of reservations",
                                            type:"error",
                                            confirmButtonColor: "#C70039",
                                            html:true
                                        });
                                    }
                                }
                                else{
                                    swal({
                                        title:"Error !",
                                        text:"You have already booked ",
                                        type:"error",
                                        confirmButtonColor: "#C70039",
                                        html:true
                                    });
                                }
                            });
                        } else {
                            swal("Cancelled", "Please, take your time", "error");
                        }
                    });
            }
        }
    });

    offres.on('value', function (snap) {
        let marker = [];
        for (let i in snap.val()) {
            if (snap.val()[i].key == offerId) {
                let tab = {
                    lat: snap.val()[i].location.lat,
                    lng: snap.val()[i].location.lng
                }
                detailsVue.host_uid = snap.val()[i].host;
                marker.push(tab);
                initMap(marker);
                return;
            }
        }
    });

    // users.on('value',function (snap) {
    //     console.log(snap.val());
    //     for(let i in snap.val()){
    //         if(snap.val()[i].uid == detailsVue.host_uid ){
    //             detailsVue.host_info = snap.val()[i];
    //             console.log('found');
    //             console.log(detailsVue.host_info);
    //         }
    //     }
    // })


    function initMap(marker) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: {lat: marker[0].lat, lng: marker[0].lng},
        });

        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: marker[0],
            radius: 200
        });

        map.setOptions({scrollwheel: false});
    }
})(jQuery);