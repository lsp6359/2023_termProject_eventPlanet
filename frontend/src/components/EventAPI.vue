<template>
    <v-card>
        <div v-if="$route.path !== '/calendar'">


            <h2>행사 정보</h2>
            <v-row>
                <v-col offset="1" cols="10" v-if="this.$route.path !== '/keyword'">
                    <v-card class="pa-0" elevation="0">

                        <v-select hide-details="auto" style="border: 1px solid #764BDC;" v-model="selectedItem"
                            :items="items" label="지역을 선택해 주세요." item-text="name" item-value="value"
                            solo>
                        </v-select>

                    </v-card>
                </v-col>
            </v-row>
            <ul>
                <li v-for="(event, index) in showevents" :key="event.id">
                    <br>
                    <div style="display: flex; align-items: center;">
                        <div>

                            <img v-if="event.firstimage" :src="event.firstimage" alt="이미지 존재"
                                style="width: 200px; height: 200px;" @click="handleImageClick(event)" />
                            <img v-else src="https://via.placeholder.com/200x200.png?text=No+Image" alt="이미지가 존재하지않습니다."
                                style="width: 200px; height: 200px;" @click="handleImageClick(event)"/>
                        </div>
                        <div style="margin-left: 10px; text-align: left;">
                            <div>
                                <h3> {{ event.title }}</h3>
                            </div>
                            <div><b>주소</b>: {{ event.addr1 }}</div>


                            <span v-if="data2Array[index] && data2Array[index].eventplace">
                                <b>장소</b>: {{ data2Array[index].eventplace }}
                            </span>
                            <span v-else>
                                장소 정보 없음
                            </span>


                            <div><b>축제 기간</b>: {{ event.eventstartdate }} - {{ event.eventenddate }}</div>


                            <span v-if="data2Array[index] && data2Array[index].eventhomepage">
                                <b>예매정보</b>: <a :href="data2Array[index].eventhomepage" v-html="data2Array[index].eventhomepage"></a>
                            </span>
                            <span v-else>
                                예매정보 없음
                            </span>

                
                        </div>
                    </div>
                    <hr>
                    <br>
                </li>
            </ul>
            <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
        </div>


    </v-card>
</template>
  
<script>

export default {
    data() {
        return {
            items: [
                { name: '서울', value: 1 },
                { name: '인천', value: 2 },
                { name: '대전', value: 3 },
                { name: '대구', value: 4 },
                { name: '광주', value: 5 },
                { name: '부산', value: 6 },
                { name: '울산', value: 7 },
                { name: '세종', value: 8 }
            ],
            hasMoreData: true,
            showevents: [], //보여질 이벤트 데이터
            events: [], // 전체 이벤트 데이터
            currentPage: 1,
            homepage: [],
            
            data2Array:[],

            showContent: false,
            selectedItem: null,

            itemsPerPage: 5,  //한페이지에 보여줄 갯수

        };
    },
    watch: {
        currentPage() {
            this.updateDisplayedEvents();

        },

        // 선택된 지역이 바뀐다면 이벤트버스로 EventAPI.vue로 바뀐 지역 전송
        selectedItem() {
            const selectedIndex = this.items.indexOf(this.selectedItem) + 1;
            this.getselectedItem(this.selectedItem);
            
        },
    },
    computed: {
        // 전체 페이지 수 계산
        totalPages() {
            return Math.ceil(this.events.length / this.itemsPerPage);
        },
    },

    methods: {
        async getselectedItem(setSelectedItem) {
            try {
                this.currentPage = 1;
                const selItem = this.selectedItem !== setSelectedItem;

                if (selItem) {
                    this.selectedItem = parseInt(setSelectedItem);
                    this.homepage = [];
                    this.events = []; // 키워드가 변경된 경우, 이전 데이터를 초기화
                    this.currentPage = 1; // 페이지를 다시 1로 설정
                    this.hasMoreData = true; // 새로운 키워드로 검색하므로 더 많은 데이터가 있을 수 있음

                }
                // 현재 날짜의 Date 객체 생성
                const currentDate = new Date();

                // 현재 달의 첫째 날 계산
                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                // 현재 달의 마지막 날 계산
                const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                // 첫째 날과 마지막 날의 날짜를 YYYYMMDD 형식의 문자열로 변환
                const formattedFirstDay = formatDate(firstDayOfMonth);
                const formattedLastDay = formatDate(lastDayOfMonth);
                console.log("시작일 마감일 : " + formattedFirstDay + "-" + formattedLastDay);

                function formatDate(date) {
                    const year = date.getFullYear();
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    return `${year}${month}${day}`;
                }

                if (true) {
                    this.events = [];
                    this.data2Array = [];
                    let serviceKey = 'bmDxI%2F3KJw7bCGRhEHG%2F3wiUzRAy5FJ0%2BUJwAXV%2BQpXSuQSs4MwYaDw8iBnhKtrsLUtyD3dxsFZ%2FVAiSTiSyFg%3D%3D'
                    const response = await this.axios.get(`http://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=WIN&MobileApp=WebTest&pageNo=${this.currentPage}&numOfRows=50&eventStartDate=${formattedFirstDay}&eventEndDate=${formattedLastDay}&areaCode=${this.selectedItem}&_type=json&serviceKey=${serviceKey}`);
                   
                    const newEvents = response.data.response.body.items.item;

                    

                    for (const item1 of newEvents) {
                        const contentId = item1.contentid;
                        console.log('첫 번째 API에서 얻은 콘텐츠 아이디:', contentId);
                        try {
                            // 시작일, 마감일, 장소를 가져오기위한 api
                            const response2 = await this.axios.get(
                                `http://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=WIN&MobileApp=WebTest&contentId=${contentId}&contentTypeId=15&_type=json&serviceKey=${serviceKey}`
                            );
                            const item2 = response2.data.response.body.items.item;
                            // 필요한 데이터를 배열에 추가
                            this.data2Array.push({
                                eventplace: item2[0].eventplace,
                                eventhomepage: item2[0].bookingplace
                            });

                        } catch (error2) {
                            console.error('두 번째 API 호출 중 에러 발생:', error2);
                        }
                        console.log('이벤트api2번째', this.data2Array);
                    }

                    if (newEvents && newEvents.length > 0) {
                        const contentIds = newEvents.map(event => event.contentid);

                        //this.$bus.$emit('contentid', contentIds); // eventHomepage뷰로 contentid 전달
                        console.log('콘텍트아이디 보냄', contentIds);
                        this.events = this.events.concat(newEvents); // 새로운 데이터를 기존 데이터에 추가

                    }
                }
                this.updateDisplayedEvents();

            } catch (error) {
                console.error('Error fetching events:', error);
            }


        },
        // eventData(getEventData) {
        //     const homepages = getEventData.map(item => item.homepage);
        //     this.homepage = this.homepage.concat(homepages);
        //     console.log('홈페이지옴', this.homepage);

        // },

        async handleCalendarDateChange(startDate, endDate) {
            function formatDateToYYYYMMDD(dateString) {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}${month}${day}`;
            }

            const formattedStartDate = formatDateToYYYYMMDD(startDate);
            const formattedEndDate = formatDateToYYYYMMDD(endDate);
            console.log(formattedStartDate);

            if ("$route.path == '/calendar'") {
                let serviceKey = 'bmDxI%2F3KJw7bCGRhEHG%2F3wiUzRAy5FJ0%2BUJwAXV%2BQpXSuQSs4MwYaDw8iBnhKtrsLUtyD3dxsFZ%2FVAiSTiSyFg%3D%3D'
                const response = await this.axios.get(`http://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=WIN&MobileApp=WebTest&numOfRows=300&eventStartDate=${formattedStartDate}&eventEndDate=${formattedEndDate}&areaCode=${this.selectedItem}&_type=json&serviceKey=${serviceKey}`);
              
                const newEvents = response.data.response.body.items.item;
              
                if (newEvents && newEvents.length > 0) {
         
                    this.events = this.events.concat(newEvents); // 새로운 데이터를 기존 데이터에 추가
                }
              
                console.log("이벤트API에서 보내줄 데이터:")
                console.log(this.events);
                this.events = [];
            }
        },
        // 현재 페이지에 따라 표시할 이벤트를 업데이트합니다.
        updateDisplayedEvents() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            this.showevents = this.events.slice(start, end);
        },

        // 선택된 축제 장소가 구글맵에 표시되게 하기 위해 이벤트버스로 주소 전송
        handleImageClick(index) {

            // 구글맵에 주소를 보내기위한 이벤트버스
            this.$bus.$emit('sendEventLocation', index.addr1);

        },

    },
    created() {
        // 달력에서 month를 이동시켰을 때 해당 달의 첫날, 마지막날 받아오기
        this.$bus.$on('calendarDateChange', this.handleCalendarDateChange);
    },

    mounted() {
        //this.$bus.$on('sendhomepage', this.eventData);

    },

};
</script>

<style scoped>
li {
    list-style: none;
    /* 리스트 마커를 제거합니다. */
}
</style>