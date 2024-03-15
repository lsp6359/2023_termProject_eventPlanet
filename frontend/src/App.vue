<template>
  <v-app>
    <!-- APP bar -->
    <v-app-bar app color="#56627D" dark>

      <v-app-bar-nav-icon @click.stop="bDrawer = !bDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <h1><router-link to="/eventCrawling" style="text-decoration: none;">행사 Planet</router-link></h1>
      </v-toolbar-title>
      <v-spacer></v-spacer><!--오른쪽으로 붙이기 위해 씀-->
      <template v-if="isUserLogin">
        <span>{{  getUsername   }}님 안녕하세요</span>
        <v-btn class="blue" style="margin-left: 8px;" @click="logout">로그아웃</v-btn>
      </template>
      
      <template v-if="!isUserLogin">
        <router-link to="/login"><v-btn class="blue" style="margin-right: 8px;">로그인</v-btn></router-link>  
        <router-link to="/subscribe"><v-btn class="blue" style="margin-right: 8px;">회원가입</v-btn></router-link>
      </template>




    </v-app-bar>
    <!-- APP bar -->

    <!--=====================================-->
    <v-navigation-drawer absolute temporary v-model="bDrawer">
      <v-toolbar flat height="100px">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-avatar>
                <img src="./assets/logo.png">
              </v-list-item-avatar>
              <v-list-item-title class="title">관리자 페이지</v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list class="pt-3">
        <v-list-item v-for="item in Draweritems" :key="item.text">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn @click="goToPage(item.to)">{{ item.text }}</v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>


    <!--=====================================-->
    <v-main style="background: linear-gradient(to bottom, #ffffff 10%, #A1B4F4 100%);">


      <v-container>
        <v-row>
  
          <v-col cols="7">
          </v-col>

          <v-col cols="5" align-self="center">
            <!-- <b>
              <p>{{ selectedItem ? `${selectedItem}` : '지역 선택 ' }}</p>
            </b> -->
          </v-col>

          <v-col offset="1" cols="10" style="padding:0; text-align: left;">
            <nav>
              <v-btn-toggle color=#764BDC>
                <v-btn to="/eventCrawling" depressed>
                  최근행사
                </v-btn>
                <!-- style="margin-right: 200px;"-->
                <v-btn to="/calendar" depressed>
                  달력보기
                </v-btn>
                <v-btn to="/eventAPI" depressed>
                  지역으로보기
                </v-btn>
                <v-btn>
                  <v-btn @click="toggleSearch" icon>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-btn>
              </v-btn-toggle>
            </nav>
          </v-col>

          <v-col cols="12">
            <router-view />
          </v-col>

        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data: () => ({


    isLogin: false,
    testData: '',
    bDrawer: false,
    Draweritems: [
      { text: '축제 추가하기', icon: 'mdi-star', to: '/adminpage' },
      // { text: '안내판', icon: 'mdi-account-multiple', to: '/eventCrawling' },
      { text: '계정 확인', icon: 'mdi-star', to: '/member' },
      
    ],

    username: '',




  }),
  computed: {
    isUserLogin() {
      return this.$store.getters.isLogin;
    },

    getUsername() {
      return this.$store.getters.username;
    },
    
  },
  methods: {
    goToPage(path) {
      this.$router.push(path);
    },


    logout() {
      this.$store.commit('setUsername', '');
      try {
        axios.get('http://127.0.0.1:8000/logout')
          .then(response => {
            if (response.status === 200) {
              alert('로그아웃');
              this.isLogin = false;
              this.$router.push('/login');  // '/login' 경로로 이동하도록 수정합니다.
            }
          })
          .catch(error => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }

    },

    // 검색창 토글 메서드
    toggleSearch() {
      if (this.$route.path !== '/keyword') {
        this.$router.push('/keyword');
      }
    },




  },



};
</script>

<style scoped>
.border_style {
  border-color: rgb(5, 121, 30);
  border-width: 2px;
  border-style: solid;
  border-radius: 1px;
  /*background-color: rgb(153, 204, 14);*/
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}



nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}



.search-btn {
  position: absolute;
  top: 8px;
  right: 100px;
}

.close-search-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>