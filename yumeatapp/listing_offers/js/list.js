(function ($) {
    const config = {
        apiKey: "AIzaSyBx5UUhgfcRXXd_NDy_8cgbs5hzKXWILNQ",
        authDomain: "yumeat-98b45.firebaseapp.com",
        databaseURL: "https://yumeat-98b45.firebaseio.com",
        projectId: "yumeat-98b45",
        storageBucket: "yumeat-98b45.appspot.com",
        messagingSenderId: "773340535737"
    };

    const yumeatdb = (firebase.initializeApp(config)).database();

    let offersVue = new Vue({
            el: "#container",
            firebase: function () {
                return {
                    offres: yumeatdb.ref('offres'),
                    users: yumeatdb.ref('users')
                }
            },
            data: {
                cityKeyword: '',
                sleepChecked: false,

            },

            mounted: function () {
            },

            methods: {
                search: function () {
                    let searchRequest = $("#search").val();
                    let true_searchRequest = searchRequest.split(',');
                    true_searchRequest = true_searchRequest[0].toLowerCase();
                    this.cityKeyword = true_searchRequest;
                    // console.log(this.cityKeyword);

                    // ici tu filtres directement en fct de ta recherche
                    // el l'occurence le mieux c'est d'abord de filtrer par ville et ensuite le sleep en js
                    if (this.cityKeyword != "") {
                        this.$bindAsArray('offres', yumeatdb.ref('offres').orderByChild('city').equalTo(this.cityKeyword));
                    } else {
                        this.$bindAsArray('offres', yumeatdb.ref('offres'));
                    }
                    showOffers();
                },
                url: function (item) {
                    // console.log(item);
                    return '../offers_detail/offers_detail.html?' + item.key
                }
            }

        });

    // console.log(this.offres)

    let position;
    let map;
    let circles = [];

    // init geoloc
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(initMap, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    // init map si geoloc
    function initMap(position) {
        position = position;
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: position.coords.latitude, lng: position.coords.longitude},
            zoom: 13,
            mapTypeId: 'roadmap'
        });

        //autocomplete
        let input = document.getElementById('search');
        let autocomplete = new google.maps.places.Autocomplete(input, {types: ['(cities)']});

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            // console.log(place);

            if (!place.geometry) {
                console.log("Autocomplete's returned place contains no geometry");
                return;
            }
            offersVue.search();
        });

    }


    function showOffers() {

        let offres = offersVue.offres;

        // console.log(offres);
        let markers = [];
        let bounds = new google.maps.LatLngBounds();

        // cirlces cleanup
        for (let i = 0; i < circles.length; i++) {
            circles[i].setMap(null);
        }
        circles = [];

        // create based on offers
        for (offre of offres) {
            // console.log(offre);
            let tab = {
                lat: offre.location.lat,
                lng: offre.location.lng
            }
            bounds.extend(tab);

            markers.push(tab);
            //circles add
            let circle = {
                strokeColor: ((offre.sleep) ? '#59A9FD' : '#FF0000'),
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: ((offre.sleep) ? '#59A9FD' : '#FF0000'),
                fillOpacity: 0.35,
                map: map,
                center: tab,
                radius: 300
            };
            circles.push(new google.maps.Circle(circle));
        }
        if(markers !== 0){
            map.setZoom(3);
            map.fitBounds(bounds);
        }
        // console.log(markers);
    }

    function showError(error) {
        switch (error.code) {
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

// TODO : ca c 'est caca
//     function createClickableCircle(map, circle) {
//         var infowindow = new google.maps.InfoWindow({
//             content: "test"
//         });
//         google.maps.event.addListener(circle, 'click', function () {
//             infowindow.setPosition(circle.getCenter());
//             infowindow.open(map);
//         });
//     }


    // lancement geoloc
    getLocation();
})(jQuery);