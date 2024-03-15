<template>
    <v-app>

        <div class="ma-4" style="height: 50%">

            <v-row>
                <v-col offset="1" cols="10">
                    <v-card class="pa-0" elevation="0">

                        <v-select hide-details="auto" style="border: 1px solid #764BDC;" v-model="selectedItem"
                            :items="items" label="지역을 선택해 주세요." item-text="name" item-value="value" solo>
                        </v-select>
                    </v-card>
                </v-col>
            </v-row>


            <v-row>
                <v-col cols="6" class="d-flex justify-end align-center">
                    <v-btn text small color="grey darken-2" @click="prev">
                        <v-icon small>
                            mdi-chevron-left
                        </v-icon>
                    </v-btn>

                    <!-- 현재 월을 표시 -->
                    <v-toolbar-title class="title" v-if="$refs.calendar">
                        {{ $refs.calendar.title }}
                    </v-toolbar-title>
                    <v-toolbar-title class="title" v-else>
                        <!-- 현재 월을 표시 -->
                        {{ getCalendarDate() }}
                    </v-toolbar-title>

                    <v-btn text small color="grey darken-2" @click="next">
                        <v-icon small>
                            mdi-chevron-right
                        </v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                        MONTH
                    </v-btn>

                </v-col>

                <v-col cols="12">
                    <v-calendar ref="calendar" :type="type" @click:event="showMoreEvents" @click:more="viewDay"
                        @click:date="viewDay" class="custom-calendar max-w-full" is-expanded v-model="focus"
                        :events="events.concat(DataBaseEvents)">
                    </v-calendar>
                </v-col>


                <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
                    <v-card color="grey lighten-4" min-width="350px" flat>
                        <v-toolbar :color="selectedEvent.color" dark>
                            <v-btn icon>
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>mdi-heart</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <span v-html="selectedEvent.details"></span>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="secondary" @click="selectedOpen = false">
                                Cancel
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-row>
        </div>
    </v-app>
</template>
  
<script>
import axios from 'axios'
export default {
    name: 'App',

    data() {
        return {
            urlinfo: 'http://127.0.0.1:8000/userevents',

            type: 'month',
            currentDate: new Date().toISOString().substring(0, 10),
            startDate: 0,
            endDate: 0,
            focus: '',

            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
            DataBaseEvents: [],
            TestLocationNumber: 0,


            selectedItem: null,
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
        };
    },
    watch: {


        selectedItem() {

            this.getselectedItem(this.selectedItem);


        },
    },
    created() {

        const socket = this.$socket;
        this.$socket.on('newEvent', (data) => {
            //if (this.$route.path === '/adminpage') {
            console.log(data);
            // eventStartDay와 eventEndDay가 정의되어 있고 문자열인 경우에만 처리
            if (data.eventStartDay && data.eventEndDay) {
                const SDAY = new Date(data.eventStartDay);
                const EDAY = new Date(data.eventEndDay);
                const formatSDAY = SDAY.toISOString().split('T')[0];
                const formatEDAY = EDAY.toISOString().split('T')[0];

                this.DataBaseEvents.push({
                    name: data.eventName,
                    start: formatSDAY,
                    end: formatEDAY,
                });
                console.log(this.DataBaseEvents)
            } else {
                console.error(`eventStartDay 또는 eventEndDay가 적절한 형식이 아닙니다.`);
            }
            //}
        });

        // 클라이언트에서 'deleteEvent' 이벤트를 리스닝
        this.$socket.on('deleteEvent', (data) => {
            this.events = [];
            this.DataBaseEvents = [];

        });

    },
    mounted() {

        this.$refs.calendar.checkChange()



    },

    methods: {

        getCalendarDate() {
            const calendar = this.$refs.calendar;
            if (calendar && typeof calendar.getVisibleEvents === 'function') {
                const visibleEvents = calendar.getVisibleEvents();
                if (visibleEvents.length > 0) {
                    // 첫 번째 이벤트의 시작 날짜를 가져옵니다.
                    return visibleEvents[0].start;
                }
            }
            // 기본적으로 오늘의 날짜를 반환합니다.
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

            return `${month}월 ${year}`;
        },

        showMoreEvents({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
            }

            if (this.selectedOpen) {
                this.selectedOpen = false
                requestAnimationFrame(() => requestAnimationFrame(() => open()))
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        viewDay({ date }) {
            this.focus = date
            this.type = 'week'
        },
        async getselectedItem(setSelectedItem) {
            try {
                this.events = [];
                this.currentPage = 1;
                const selItem = this.selectedItem !== setSelectedItem;

                if (selItem) {
                    this.selectedItem = parseInt(setSelectedItem);
                    this.homepage = [];
                    this.events = []; // 키워드가 변경된 경우, 이전 데이터를 초기화
                    this.currentPage = 1; // 페이지를 다시 1로 설정
                    this.hasMoreData = true; // 새로운 키워드로 검색하므로 더 많은 데이터가 있을 수 있음

                }



                const formattedFirstDay = formatYear(this.$refs.calendar.lastStart.date);
                const formattedLastDay = formatYear(this.$refs.calendar.lastEnd.date);
                console.log("시작일 마감일 : " + formattedFirstDay + "-" + formattedLastDay);

                function formatYear(dateString) {
                    const date = new Date(dateString);
                    const year = date.getFullYear();
                    return `${year}`;
                }


                let serviceKey = 'bmDxI%2F3KJw7bCGRhEHG%2F3wiUzRAy5FJ0%2BUJwAXV%2BQpXSuQSs4MwYaDw8iBnhKtrsLUtyD3dxsFZ%2FVAiSTiSyFg%3D%3D'
                const response = await this.axios.get(`http://apis.data.go.kr/B551011/KorService1/searchFestival1?MobileOS=WIN&MobileApp=WebTest&numOfRows=1000&eventStartDate=${formattedFirstDay}0101&eventEndDate=${formattedLastDay}1231&areaCode=${setSelectedItem}&_type=json&serviceKey=${serviceKey}`);
                // 인증키1 NNMlfJvtCxCDfwt0PP4Nebtul2vSAhEjQEhMTNHBWLDYCOppGMmuLGA9EvdoZmY7BoyIlCGw96tjiko848Zntw%3D%3D
                // 내 인증키 bmDxI%2F3KJw7bCGRhEHG%2F3wiUzRAy5FJ0%2BUJwAXV%2BQpXSuQSs4MwYaDw8iBnhKtrsLUtyD3dxsFZ%2FVAiSTiSyFg%3D%3D
                
                const newEvents = response.data.response.body.items.item;

                if (response.data.response.body.totalCount != 0) {


                    for (let i = 0; i < newEvents.length; i++) {
                        const dateString1 = newEvents[i].eventstartdate;
                        const formattedDateString1 = `${dateString1.slice(0, 4)}-${dateString1.slice(4, 6)}-${dateString1.slice(6, 8)}`;
                        const dateString = newEvents[i].eventenddate;
                        const formattedDateString = `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;

                        this.$set(this.events, this.events.length, {
                            name: newEvents[i].title,
                            start: formattedDateString1,
                            end: formattedDateString,
                        });
                    }

                } else {
                    alert(`2024년도 ${this.items.find(item => item.value === this.selectedItem).name}지역은 아직 예정된 행사데이터가 없습니다.`);
                }


                // db에 있는거 가져오기
                axios.get(this.urlinfo) //서버에 요청하기
                    .then((res) => {
                        {
                            this.DataBaseEvents = [];
                            for (let i = 0; i < res.data.length; i++) {
                                //console.log(res.data[i].eventLocation, '랑 ==', getSelectedItem[0].areacode);
                                if (res.data[i].eventLocation == setSelectedItem) {

                                    const SDAY = new Date(res.data[i].eventStartDay);
                                    const EDAY = new Date(res.data[i].eventEndDay);
                                    const formatSDAY = SDAY.toISOString().split('T')[0];
                                    const formatEDAY = EDAY.toISOString().split('T')[0];

                                    this.DataBaseEvents.push({
                                        name: res.data[i].eventName,
                                        start: formatSDAY,
                                        end: formatEDAY,
                                    });

                                }

                            }


                        }

                    })
                    .catch((err) => {
                        console.log(err);
                        alert('에러 발생: ' + err); //에러 발생
                    });

            } catch (error) {
                console.error('Error fetching events:', error);
            }


        },


        prev() {
            // 현재 선택된 연도

            const currentYear = new Date(this.$refs.calendar.lastStart.date).getFullYear();

            this.$refs.calendar.prev();

            // this.$nextTick을 사용하여 다음 프레임에서 이벤트를 발생시킴
            this.$nextTick(() => {
                // 캘린더의 년도
                const calendarYear = new Date(this.$refs.calendar.lastStart.date).getFullYear();
                // 현재 선택된 연도와 캘린더의 년도를 비교
                if (currentYear !== calendarYear) {
                    // 년도가 변경된 경우에만 getselectedItem 실행
                    this.getselectedItem(this.selectedItem);
                }
            });
        },
        next() {
            // 현재 선택된 연도
            const currentYear = new Date(this.$refs.calendar.lastStart.date).getFullYear();
            console.log('@@@', currentYear);
            this.$refs.calendar.next();

            // this.$nextTick을 사용하여 다음 프레임에서 이벤트를 발생시킴
            this.$nextTick(() => {
                // 캘린더의 년도
                // const calendarYear = new Date(this.$refs.calendar.lastStart.date).getFullYear();
                const calendarYear = new Date(Date.parse(this.$refs.calendar.lastStart.date)).getFullYear();

                console.log('###', this.$refs.calendar.lastStart.date);
                console.log('###', calendarYear);
                // 현재 선택된 연도와 캘린더의 년도를 비교
                if (currentYear !== calendarYear) {
                    // 년도가 변경된 경우에만 getselectedItem 실행
                    this.getselectedItem(this.selectedItem);
                }

            });
        },
        setToday() {
            this.focus = ''
            this.type = 'month'
        },



    },
};
</script>


<style scoped>
.custom-calendar {
    height: 600px;
}

.title {
    display: inline-block;
    /* 인라인 블록으로 설정하여 같은 줄에 위치하도록 함 */
    margin-right: 0px;
    /* 필요에 따라 간격 조정 */
    text-align: center;
    /* 가운데 정렬을 추가 */

}
</style>
