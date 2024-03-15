<!--키워드 검색, 단일 컴포넌트-->
<template>
    <v-card>
        <div class="centered-container">
            <h2>키워드를 입력해주세요</h2>

            <v-row>
                <v-col offset="1" cols="10">
                    <v-text-field v-model="keyword" label="키워드" hide-details></v-text-field>
                </v-col>

                <v-col cols="1" class="d-flex align-center" style="padding: 0; ">
                    <v-btn @click="performSearch" color="primary" icon><v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
            </v-row>


            <ul>

                <li v-for="(event, index) in showevents" :key="index">
                    <br />
                    <div style="display: flex; align-items: center;">
                        <div>
                            <img v-if="event.firstimage" :src="event.firstimage"
                                alt="이미지가 존재" style="width: 200px; height: 200px;" @click="handleImageClick(event)" />
       
                            <img v-else src="@/assets/no_img.png" alt="이미지가 존재하지 않습니다."
                                style="width: 200px; height: 200px;" @click="handleImageClick(event)" />

                        </div>
                        <div style="margin-left: 10px; text-align: left;">
                            <div>
                                <h3>{{ event.title }}</h3>
                            </div>
                            <div><b>주소</b>: {{ event.addr1 }}</div>

                            <span v-if="event.eventplace">
                                <b>장소</b>: {{ event.eventplace }}
                            </span>
                            <span v-else>
                                장소 정보 없음
                            </span>
                            <br>
                            <span v-if="event.eventstartdate && event.eventenddate">
                                <b>축제시간</b>: {{ event.eventstartdate }} ~ {{ event.eventenddate }}
                            </span>
                            <span v-else>
                                축제시간 정보 없음
                            </span>
                            <br>
                            <span v-if="event.eventhomepage">
                                <b>예매정보</b>: <a :href="event.eventhomepage" v-html="event.eventhomepage"></a>
                            </span>
                            <span v-else>
                                예매정보 없음
                            </span>

                        </div>
                    </div>
                    <hr />
                    <br />
                </li>
            </ul>
            <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>

        </div>
    </v-card>
</template>
  
<script>
export default {
    name: 'event-info3',
    data() {
        return {
            keyword: '',
            events: [],
            currentPage: 1,

            // hasMoreData: true,
            showevents: [],

            itemsPerPage: 5,

            contentIds: [],

            // eventstartdates: [],
            eventstartdate: [],

            // eventenddates: [],
            eventenddate: [],

            // eventplaces: [],
            eventplace: []
        };
    },
    watch: {

        currentPage() {
            this.updateDisplayedEvents();
        },

    },
    computed: {

        // 전체 페이지 수 계산
        totalPages() {
            return Math.ceil(this.events.length / this.itemsPerPage);
        },

    },
    methods: {

        // 현재 페이지에 따라 표시할 이벤트를 업데이트합니다.
        updateDisplayedEvents() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            this.showevents = this.events.slice(start, end);
        },

       

        async performSearch() {
            if (this.keyword !== '') {
                this.currentPage=1;

                try {
                    const encodedKeyword = encodeURIComponent(this.keyword);
                    const serviceKey = 'bmDxI%2F3KJw7bCGRhEHG%2F3wiUzRAy5FJ0%2BUJwAXV%2BQpXSuQSs4MwYaDw8iBnhKtrsLUtyD3dxsFZ%2FVAiSTiSyFg%3D%3D';

                    const response1 = await this.axios.get(
                        `http://apis.data.go.kr/B551011/KorService1/searchKeyword1?MobileOS=WIN&MobileApp=WebTest&pageNo=${this.currentPage}&numOfRows=50&contentTypeId=15&keyword=${encodedKeyword}&_type=json&serviceKey=${serviceKey}`
                    );

                    const data1 = response1.data.response.body.items.item;

                    // 배열 초기화
                    this.events = [];
                    const data2Array = [];

                    // 첫 번째 API의 응답 처리
                    for (const item1 of data1) {
                        const contentId = item1.contentid;
                        console.log('첫 번째 API에서 얻은 콘텐츠 아이디:', contentId);

                        try {
                            // 시작일, 마감일, 장소를 가져오기위한 api
                            const response2 = await this.axios.get(
                                `http://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=WIN&MobileApp=WebTest&contentId=${contentId}&contentTypeId=15&_type=json&serviceKey=${serviceKey}`
                            );
                            const item2 = response2.data.response.body.items.item;
                            // 필요한 데이터를 배열에 추가
                            data2Array.push({
                                // 두 번째 API에서 얻은 데이터
                                eventstartdate: item2[0].eventstartdate,
                                eventenddate: item2[0].eventenddate,
                                eventplace: item2[0].eventplace,
                                eventhomepage: item2[0].bookingplace
                            });




                        } catch (error2) {
                            console.error('두 번째 API 호출 중 에러 발생:', error2);
                        }
                    };

                    // 두 배열을 조합하여 최종적인 배열 생성
                    this.events = data1.map((item1, index) => ({
                        ...item1,
                        ...data2Array[index],
                        // 추가로 필요한 데이터
                    }));

                    console.log('최종적인 이벤트 배열:', this.events);

                    this.updateDisplayedEvents();


                } catch (error1) {
                    console.error('첫 번째 API 호출 중 에러 발생:', error1);
                }


            } else {
                // if (this.$route.path !== '/eventCrawling') {
                //     this.$router.push('/eventCrawling');
                // }
                console.log("키워드 : " + this.keyword);
            }
        },
        // 선택된 축제 장소가 구글맵에 표시되게 하기 위해 이벤트버스로 주소 전송
        handleImageClick(index) {

            this.$bus.$emit('sendEventLocation', index.addr1);

        },


    },
};
</script>
  
<style scoped>
.centered-container {
    max-width: 1000px;
    margin: 0 auto;
    /* 가로 가운데 정렬을 위한 스타일 */
}

li {
    list-style: none;
    /* 리스트 마커를 제거합니다. */
}
</style>
  