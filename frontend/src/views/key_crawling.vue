<!--크롤링데이터 보여주는 뷰-->
<template>
  <div>
    <recentEvent/>
  </div>
</template>
  
<script>
import recentEvent from '@/components/recentEvent.vue'

export default {

  name: 'crawling',
  components: {
    recentEvent,
  
  },
  data() {
    return {
      
    };
  },
 

}
</script>
  

