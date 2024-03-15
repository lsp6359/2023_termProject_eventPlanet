<!--크롤링 데이터 나열-->
<template>
    <v-row justify="center">
        <v-col cols="10">
            <v-card>
                <v-card-title>지역축제</v-card-title>
                <v-card-text>
                    <div v-for="event in displayedEvents" :key="event.title">
                        <img :src="event.picture" alt="Event Image"
                            style="width: 150px; height: 150px; border: 5px solid black">
                        <div style="margin-left: 10px; font-size: 20px">
                            <br><b>{{ event.title }}</b><br>{{ event.location }}<br>{{ event.period }}
                        </div>
                        <br>
                        <hr>
                        <br>
                    </div>
                    <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
  
<script>
import axios from 'axios'
export default {
    data() {
        return {
            events: [],         // 전체 이벤트 데이터
            displayedEvents: [], // 현재 페이지에 표시할 이벤트 데이터
            itemsPerPage: 5,     // 페이지 당 표시할 이벤트 수
            currentPage: 1,      // 현재 페이지
            urlinfo:'http://127.0.0.1:8000/eventCrawling',
            
        };
    },
    mounted() {
        // 백엔드 API로 요청을 보냅니다.
        axios.get(this.urlinfo, { withCredentials: true }) //서버에 요청하기
      .then((res) => {
        console.log(res.data); //성공시
        this.events = res.data.events;
        console.log(this.events);
        this.updateDisplayedEvents();
      
      })
      .catch((err) => {
        alert('에러 발생: ' + err); //에러 발생
      });
        

    },
    computed: {
        // 전체 페이지 수 계산
        totalPages() {
            return Math.ceil(this.events.length / this.itemsPerPage);
        },
    },
    watch: {
        // 현재 페이지가 변경될 때마다 페이지를 업데이트합니다.
        currentPage() {
            this.updateDisplayedEvents();
        },
    },
    methods: {
        // 현재 페이지에 따라 표시할 이벤트를 업데이트합니다.
        updateDisplayedEvents() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            this.displayedEvents = this.events.slice(start, end);
        },
    },
};
</script>
  
  