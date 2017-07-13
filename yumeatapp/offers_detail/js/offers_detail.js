$(document).ready(function () {
    var s = window.location.href.split('?');
    var offerId = s[1];

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
    let users = firebase.database().ref('users/');

    new Vue({
        el: "#container",
        firebase: {
            offres: offres,
            users: users
        },
        data: {
            offerID: offerId
        }
    });

    console.log(offres)

    offres.on('value', function (snap) {
        let marker = [];
        for (let i in snap.val()) {
            if (snap.val()[i].key == offerId) {
                console.log('found');
                let tab = {
                    lat: snap.val()[i].location.lat,
                    lng: snap.val()[i].location.lng
                }
                console.log(tab);
                marker.push(tab);
                console.log(snap.val()[i].key)
                console.log(marker);
                initMap(marker);
                return;
            }
        }
    });

    function initMap(marker) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: {lat: marker[0].lat, lng: marker[0].lng},
            mapTypeId: 'terrain'
        });

        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: marker[0],
            radius: 500
        });

        map.setOptions({scrollwheel: false});
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if(user){

        }
    });

})