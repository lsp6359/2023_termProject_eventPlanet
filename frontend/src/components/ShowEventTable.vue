<!--관리자 페이지에 보여질 이벤트 테이블-->
<template>
    <div id="app">

        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ dialogTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>

                            <v-layout wrap v-if="dialogTitle !== '삭제'">
                                <!-- <v-flex xs12>
                                    <v-text-field label="번호" v-model="eventInfo.eventNum" required></v-text-field>
                                </v-flex> -->
                                <v-flex xs12>
                                    <v-text-field label="번호" v-model="eventInfo.eventNum" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="축제이름" v-model="eventInfo.eventName" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-menu v-model="selectedCity" :close-on-content-click="false" :nudge-right="40"
                                        transition="scale-transition" offset-y>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="eventInfo.eventLocation" label="지역" v-on="on" required
                                                readonly></v-text-field>
                                        </template>
                                        <v-list>
                                            <v-list-item v-for="(city, index) in cities" :key="index"
                                                @click="selectCity(index)">
                                                <v-list-item-title>{{ city }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-flex>


                                <v-flex xs12>
                                    <v-text-field label="시작일" v-model="eventInfo.eventStartDay" type="date"
                                        required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="종료일" v-model="eventInfo.eventEndDay" type="date"
                                        required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="축제내용" v-model="eventInfo.eventContent" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="등록일" v-model="eventInfo.register_date" required></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-layout wrap v-if="dialogTitle === '삭제'">
                                <v-flex xs12>
                                    <v-text-field label="번호" v-model="eventInfo.eventNum" required></v-text-field>
                                </v-flex>
                            </v-layout>


                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="btnClick($event)">취소</v-btn>
                        <v-btn color="blue darken-1" text @click="btnClick($event)">확인</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>

        <v-row>
            <v-col cols="12" offset="5" style="padding:0;">
                <v-btn color="primary" v-on:click.native="addContact()">추가</v-btn>
            </v-col>
            <v-col cols="12" style="padding:0;">
                <v-data-table dense :headers="headers" :items="items" class="elevation-1"
                    loading-text="Loading... Please wait">

                    <template v-slot:item="row">
                        <tr>
                            <td>{{ row.item.eventNum }}</td>
                            <td>{{ row.item.eventName }}</td>
                            <td>{{ row.item.eventLocation }}</td>
                            <td>{{ row.item.eventStartDay }}</td>
                            <td>{{ row.item.eventEndDay }}</td>
                            <td>{{ row.item.eventContent }}</td>
                            <td>{{ row.item.register_date }}</td>
                            <td class="text-xs-right">
                                <v-icon class="mr-2" @click="updateContact(row.item)">mdi-pencil</v-icon>
                                <v-icon class="mr-2" @click="deleteContact(row.item)">mdi-delete</v-icon>
                         =
                            </td>
                        </tr>
                    </template>

                </v-data-table>
            </v-col>
        </v-row>


    </div>
</template>
    
<script>
import axios from 'axios'
export default {
    data() {
        return {
            cities: ['서울', '인천', '대전', '대구', '광주', '부산', '울산', '세종'],
            selectedCity: null,
            urlinfo: 'http://127.0.0.1:8000/events',
            eventInfo: {
                _id: null,
                eventNum: null,
                eventName: null,
                eventLocation: null,
                eventStartDay: null,
                eventEndDay: null,
                eventContent: null,
                register_date: null
            },
            dialog: false,
            dialogTitle: null,
            dialogDelete: false,
            isLogin: false,
            headers: [
                { text: '번호', align: 'left', value: 'eventNum' },
                { text: '축제이름', align: 'left', value: 'eventName', sortable: false, },
                { text: '장소', align: 'left', value: 'eventLocation', sortable: false, },
                { text: '시작일', align: 'left', value: 'eventStartDay' },
                { text: '종료일', align: 'left', value: 'eventEndDay' },
                { text: '축제내용', align: 'left', value: 'eventContent', sortable: false, },
                { text: '등록일', align: 'left', value: 'register_date', sortable: false, },
                { text: '관리', align: 'left', value: '', sortable: false, },
            ],
            items: []
        }
    },

    computed: {
        isUserLogin() {
            return this.$store.getters.isLogin;
        },
    },

    created() {


        const fetchData = async () => {
            try {
                // 비동기 요청, 데이터 로딩이 완료될 때까지 대기
                const res = await axios.get(this.urlinfo, { withCredentials: true });

                // 데이터 로딩 완료 후 작업 수행

                if (res.data.length > 0) {
                    this.items = res.data;
                }
                console.log('데이터들어감', res);

                console.log('들어감', this.items);

            } catch (err) {
                // 에러 처리
                alert('에러 발생: ' + err);
            }
        };

        // async 함수 호출
        fetchData();
    },
    methods: {
        selectCity(index) {
            // 도시를 선택할 때 해당 도시의 인덱스를 eventInfo.eventNum에 할당
            this.eventInfo.eventLocation = index + 1;
            this.selectedCity = null; // 메뉴를 닫음
        },
        addContact() {
            this.dialog = true;
            this.dialogTitle = "추가";
            this.eventInfo.register_date = Date.now();
        },
        updateContact(data) {
            this.dialog = true;
            this.dialogTitle = "수정";
            this.eventInfo.eventNum = data.eventNum;
            this.eventInfo.eventName = data.eventName;
            this.eventInfo.eventLocation = data.eventLocation;
            this.eventInfo.eventStartDay = data.eventStartDay;
            this.eventInfo.eventEndDay = data.eventEndDay;
            this.eventInfo.eventContent = data.eventContent;
            this.eventInfo.register_date = data.register_date;
        },
        deleteContact(data) {

            this.dialog = true;
            this.dialogTitle = "삭제";
            this.eventInfo.eventNum = data.eventNum;
            console.log('deleteContact : ' + data);
        },
        btnClick($event) {
            this.dialog = false;
            if ($event.target.innerHTML == "확인") {
                if (this.dialogTitle == "추가") {
                    axios.post(this.urlinfo, {
                        eventNum: this.eventInfo.eventNum,
                        eventName: this.eventInfo.eventName,
                        eventLocation: this.eventInfo.eventLocation,
                        eventStartDay: this.eventInfo.eventStartDay,
                        eventEndDay: this.eventInfo.eventEndDay,
                        eventContent: this.eventInfo.eventContent,
                        register_date: this.eventInfo.register_date
                    }, { withCredentials: true })
                        .then(() => {
                            axios.get(this.urlinfo, { withCredentials: true }) //서버에 요청하기
                                .then((res) => {
                                    //console.log(res.data); //성공시
                                    if (this.isUserLogin) {
                                        this.items = res.data;
                                        alert("행사 데이터 추가 성공");
                                    }
                                    else {
                                        alert("로그인이 필요합니다.");
                                    }

                                })
                                .catch((err) => {
                                    alert('에러 발생: ' + err); //에러 발생
                                });

                        })
                        .catch((err) => {
                            alert('에러 발생: ' + err); //에러 발생
                        });
                }
                else if (this.dialogTitle == "수정") {
                    //alert("입력된 정보 : " + "이메일 : " + this.contactInfo.email + " 패스워드 : " + this.contactInfo.password);
                    axios.put(this.urlinfo + '/' + this.eventInfo.eventNum, {
                        eventNum: this.eventInfo.eventNum, eventName: this.eventInfo.eventName, eventLocation: this.eventInfo.eventLocation,
                        eventStartDay: this.eventInfo.eventStartDay, eventEndDay: this.eventInfo.eventEndDay, eventContent: this.eventInfo.eventContent,
                        register_date: this.eventInfo.register_date
                    }, { withCredentials: true })
                        .then(() => {
                            axios.get(this.urlinfo, { withCredentials: true }) //서버에 요청하기
                                .then((res) => {

                                    if (this.isUserLogin) {
                                        this.items = res.data;
                                        alert("행사 데이터 업데이트 성공");
                                    }
                                    else {
                                        alert("로그인이 필요합니다.");
                                    }
                                })
                                .catch((err) => {
                                    alert('에러 발생: ' + err); //에러 발생
                                });
                        })
                        .catch((err) => {
                            alert('에러 발생: ' + err); //에러 발생
                        });

                }
                else {
                    axios.delete(this.urlinfo + '/' + this.eventInfo.eventNum)
                        .then((result) => {
                            console.log("삭제 후" + result); //성공시
                            axios.get(this.urlinfo) //서버에 요청하기
                                .then((res) => {
                                    this.items = res.data;
                                    alert("삭제 성공");
                                })
                                .catch((err) => {
                                    alert(' 삭제 후 데이터 가져오는 중 에러 발생: ' + err); //에러 발생
                                });
                        })
                        .catch((err) => { alert('에러 발생: ' + err); });

                }
            }
            this.eventInfo.eventNum = null;
            this.eventInfo.eventName = null;
            this.eventInfo.eventLocation = null;
            this.eventInfo.eventStartDay = null;
            this.eventInfo.eventEndDay = null;
            this.eventInfo.eventContent = null;
            this.eventInfo.register_date = null;
        }

    }
}
</script>
<style scoped>
div {
    margin: 0 5px 0 5px;
}
</style>
    