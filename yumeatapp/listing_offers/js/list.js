$(document).ready(function(){
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
            users : users
        }
        ,
        data:{
            city : '',
            searchResult:'',
            isCheckedSleep : false,
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
            click: function () {
                $(".details").on('click',function () {
                    window.location = "../offers_detail/offers_detail.html?" + $(this).parent().attr('id');
                });
            }
        },
        mounted() {
            console.log('mounted');
        }
    });

    let lat;
    let lng;

    function initMap(lat, lng, markers) {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: lat, lng: lng},
            zoom: 13,
            mapTypeId: 'roadmap'
        });

        var input = document.getElementById('search');
        var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
        google.maps.event.addListener(autocomplete, 'place_changed', function(){
            var place = autocomplete.getPlace();

            if (!place.geometry) {
                console.log("Autocomplete's returned place contains no geometry");
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(13);
            }
        });

        for( var i = 0; i < markers.length; i++){
            var circle = {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: markers[i],
                radius: 500
            };
            var circleInfo = new google.maps.Circle(circle);
            createClickableCircle(map, circleInfo);
        }
    }

    function createClickableCircle(map, circle){
        var infowindow =new google.maps.InfoWindow({
            content: "test"
        });
        google.maps.event.addListener(circle, 'click', function() {
            infowindow.setPosition(circle.getCenter());
            infowindow.open(map);
        });
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition,showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    function showPosition(position) {
        console.log(position.coords.latitude + " / "+ position.coords.longitude);
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        function initialiseMarkers(offres){
            offres.on('value',function(snap){
                let markers = [];
                for( let i in snap.val() ){
                    let tab = {
                        lat: snap.val()[i].location.lat,
                        lng: snap.val()[i].location.lng
                    }
                    console.log(tab);
                    markers.push(tab);
                }

                console.log(markers);
                initMap(lat,lng,markers);
            })
        }

        initialiseMarkers(offres);
    }

    function showError(error){
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.")
                $('#map').html("<h1 id='error_geoloc'>For a better use of our application, please enable geolocation</h1>");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.")
                break;
        }
    }

    getLocation();
});