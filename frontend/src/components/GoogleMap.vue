<template>
    <div>
        <!-- <div v-if="false" id="map-canvas" ></div> -->

        <v-dialog v-model="dialog" max-width="600">
            <v-card>
                <v-card-title>행사장 위치</v-card-title>
                <v-card-text>
                    <!-- 지도를 렌더링할 요소 -->
                    <div id="map-canvas" class="map-container"></div>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="closeDialog">닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            dialog: false, // 다이얼로그의 초기 상태 (닫혀있음)
            map: null,
            mapCenter: { lat: 35.105696, lng: 129.042857 },
            geocoder: new google.maps.Geocoder(),
            city: '',
        };
    },
    mounted() {

        this.$bus.$on('sendEventLocation', this.getLocation);

    },
    methods: {

        closeDialog() {
            this.dialog = false;
        },
        initMap() {
            this.map = new google.maps.Map(
                document.getElementById('map-canvas'),
                {
                    center: this.mapCenter,
                    zoom: 17,
                    maxZoom: 20,
                    minZoom: 3,
                    streetViewControl: true,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    zoomControl: true,
                }
            );
            this.setMarker(this.mapCenter, 'ce');
        },
        setMarker(Points, Label) {
            const markers = new google.maps.Marker({
                position: Points,
                map: this.map,
                label: {
                    text: Label,
                    color: '#FFF',
                },
            });
            this.map.addListener('center_changed', () => {
                markers.setPosition(this.map.getCenter());
            });
            this.map.addListener('dragend', () => {
                this.$bus.$emit('sendCoordinate', this.map.getCenter());
            });
        },
        getLocation(location) {
            this.dialog = true;
            this.city = location;
            setTimeout(() => {
                this.initMap();
                this.setMarker(this.mapCenter, 'ce');
                this.searchLocation();
            }, 100);

        },
        searchLocation() {

            this.geocoder.geocode({ address: this.city }, (results, status) => {
                if (status === 'OK' && results[0].geometry) {
                    const location = results[0].geometry.location;
                    this.map.setCenter(location);
                } else {
                    console.error('지오코딩 실패:', status);
                }
            });
        },
    },
};
</script>
  
<style scoped>
/* 기존 스타일 유지 */
#map-canvas {
    width: 100%;
    /* 전체 너비 사용 */
    height: 400px;
    /* 적절한 높이 지정 */
}

.map-container {
    width: 100%;
    height: 100%;
}
</style>
  