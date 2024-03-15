<!--가입한 계정을 보여주는 테이블-->
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
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="이름" v-model="userInfo.name" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="아이디" v-model="userInfo.Id" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="패스워드" v-model="userInfo.password" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="거주지" v-model="userInfo.location" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="등록일" v-model="userInfo.register_date" required></v-text-field>
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
    <v-data-table :headers="headers" :items="items" class="elevation-1">
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.name }}</td>
          <td>{{ row.item.Id }}</td>
          <td>{{ row.item.password }}</td>
          <td>{{ row.item.location }}</td>
          <td>{{ row.item.register_date }}</td>
          <td class="text-xs-right">
            <v-btn color="primary" v-on:click.native="updateContact(row.item)">수정</v-btn>
            <v-btn color="primary" v-on:click.native="deleteContact(row.item)">삭제</v-btn>
            
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
  
<script>
import axios from 'axios'
export default {
  data() {
    return {
      urlinfo: 'http://127.0.0.1:8000/users',
      userInfo: {
        name: null,
        Id: null,
        password: null,
        location: null,
        register_date: null
      },
      dialog: false,
      dialogTitle: null,

      headers: [
        { text: '이름', align: 'left', value: 'name' },
        { text: '아이디', align: 'left', value: 'Id' },
        { text: '패스워드', align: 'left', value: 'password' },
        { text: '거주지', align: 'left', value: 'location' },
        { text: '등록일', align: 'left', value: 'register_date' },
        { text: '관리', align: 'left', value: '' },
      ],
      items: []
    }
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
    fetchData();

  },
  methods: {
    addContact() {
      this.dialog = true;
      this.dialogTitle = "추가";
      this.userInfo.register_date = Date.now();
    },
    updateContact(data) {
      this.dialog = true;
      this.dialogTitle = "수정";
      this.userInfo.name = data.name;
      this.userInfo.Id = data.Id;
      this.userInfo.password = data.password;
      this.userInfo.location = data.location;
      this.userInfo.register_date = data.register_date;
    },
    deleteContact(data) {
      this.dialog = true;
      this.dialogTitle = "삭제";
      this.userInfo.Id = data.Id;
      console.log('deleteContact : ' + data);
    },
    sendEvent(data) {
      this.$bus.$emit('deviceSelected', data);
    },
    btnClick($event) {
      this.dialog = false;
      if ($event.target.innerHTML == "확인") {
        if (this.dialogTitle == "추가") {
          axios.post(this.urlinfo, {
            name: this.userInfo.name, 
            Id: this.userInfo.Id,
            password: this.userInfo.password,
            location: this.userInfo.location,
            register_date: this.userInfo.register_date
          }, { withCredentials: true })
            .then(() => {
              axios.get(this.urlinfo, { withCredentials: true }) //서버에 요청하기
                .then((res) => {
                  //console.log(res.data); //성공시
                  this.items = res.data;
                  alert("연락처 추가 성공");
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
          axios.put(this.urlinfo + '/' + this.userInfo.Id, {
            name: this.userInfo.name, 
            Id: this.userInfo.Id,
            password: this.userInfo.password,
            location: this.userInfo.location,
            register_date: this.userInfo.register_date
          })
            .then(() => {
              axios.get(this.urlinfo) //서버에 요청하기
                .then((res) => {
                  //console.log(res.data); //성공시
                  this.items = res.data;
                  alert("업데이트 성공");
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
          axios.delete(this.urlinfo + '/' + this.userInfo.Id)//, { data: { Id: this.userInfo.Id } })
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
      this.userInfo.name = null;
      this.userInfo.Id = null;
      this.userInfo.password = null;
      this.userInfo.location = null;
      this.userInfo.register_date = null;
    }

  }
}
</script>
<style scoped>
div {
  margin: 20px 5px 0 5px;
}
</style>
  