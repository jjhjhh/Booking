$(document).ready(function() {
    var map, markers = [];
    var mapContainer = document.getElementById('map');
    
    function displayMap(latitude, longitude) {
        var mapOption = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 3
        };
        map = new kakao.maps.Map(mapContainer, mapOption);
        addMarker(latitude, longitude); // 현재 위치에 마커 추가
    }

    function addMarker(latitude, longitude) {
        var markerPosition = new kakao.maps.LatLng(latitude, longitude);
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);
        markers.push(marker);
    }

    function showPlaces(keyword, latitude, longitude) {
        var places = new kakao.maps.services.Places();
        var callback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                for (var i = 0; i < result.length; i++) {
                    addMarker(result[i].y, result[i].x);
                }
            }
        };
        places.keywordSearch(keyword, callback, {
            location: new kakao.maps.LatLng(latitude, longitude),
            radius: 1000 // 반경 1km 내의 장소 검색
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            displayMap(latitude, longitude);

            // 기존 마커 제거 함수
            function clearMarkers() {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
            }


            $('.st button').click(function() {

                // <i> 색 변경
                $(".fas").removeClass("sel");
                $(this).find(".fas").addClass("sel");
                
                // 현재 위치 마커 추가
                clearMarkers();
                displayMap(latitude, longitude); 

                // 주변 탐색 버튼 위치 추가 
                text=$(this).text()
                console.log(text)
                showPlaces(text, latitude, longitude); 
            });


        }, function(error) {
            console.error(error);
            alert('현재 위치를 가져올 수 없습니다.');
        });
    } else {
        alert('GPS를 지원하지 않습니다.');
    }
});