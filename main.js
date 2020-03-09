function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -23.6815315, lng: -46.8754923 },
        zoom: 10,
    });
    infoWindow = new google.maps.InfoWindow;

    var btnPosition = document.getElementById('yourPosition');

    btnPosition.addEventListener('click', function (e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Sua localização.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });

    //Button toggle
    var toggle = document.getElementById('toggle');
    var titleToggle = document.getElementById('toggleTitle');

    toggle.addEventListener('click', function (e) {
        toggle.classList.toggle('active');
        titleToggle.classList.toggle('active')
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        var contResult = 0;

        document.getElementById('box-result').innerHTML = ''
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            //Result counter
            contResult++
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            var z = document.createElement('p'); // is a node
            z.innerHTML = 'Nome: ' + place.name + '<br>Endereço: ' + place.formatted_address;
            document.getElementById('box-result').appendChild(z);
        });

        document.getElementById('searchTotalValue').innerHTML = contResult;
        var contResult = 0;
        map.fitBounds(bounds);
    });


}
