<!--관리자 패널에서 보여지는 캘린더-->
<template>
    <v-app>


        <div class="ma-4" style="height: 50%">

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
                        :events="DataBaseEvents">
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
            urlinfo: 'http://127.0.0.1:8000/events',
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
        };
    },
    created() {
        this.init();

        this.$socket.on('newEvent', (data) => {
            //if (this.$route.path === '/adminpage') {
            this.DataBaseEvents = [];
            this.init();
            console.log(data);

            // eventStartDay와 eventEndDay가 정의되어 있고 문자열인 경우에만 처리
            if (data.eventStartDay && data.eventEndDay) {
                const SDAY = new Date(data.eventStartDay);
                const EDAY = new Date(data.eventEndDay);
                const formatSDAY = SDAY.toISOString().split('T')[0];
                const formatEDAY = EDAY.toISOString().split('T')[0];
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
            this.init();
        });
    },
    mounted() {

        this.$refs.calendar.checkChange()


    },
    methods: {
        init() {
            axios.get(this.urlinfo) //서버에 요청하기
                .then((res) => {

                    for (let i = 0; i < res.data.length; i++) {
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

                    console.log(res.data.length); //성공시



                })
                .catch((err) => {
                    console.log(err);
                    alert('에러 발생: ' + err); //에러 발생
                });
        },
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
        prev() {

            this.$refs.calendar.prev();

            // this.$nextTick을 사용하여 다음 프레임에서 이벤트를 발생시킴
            this.$nextTick(() => {
                this.$bus.$emit('calendarDateChange', this.$refs.calendar.lastStart.date, this.$refs.calendar.lastEnd.date);
            });
        },
        next() {

            this.$refs.calendar.next();

            // this.$nextTick을 사용하여 다음 프레임에서 이벤트를 발생시킴
            this.$nextTick(() => {
                this.$bus.$emit('calendarDateChange', this.$refs.calendar.lastStart.date, this.$refs.calendar.lastEnd.date);
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
