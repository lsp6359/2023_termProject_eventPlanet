<template>
  <div>
    <template>
      <EventAPI />
    </template>

    <template>
      <google />
    </template>
  </div>
</template>
  
<script>
import EventAPI from '@/components/EventAPI.vue'


//구글맵
import google from '@/components/GoogleMap.vue'

export default {
  name: 'apiHome',
  components: {
    EventAPI,
    google,
  }
}
</script>
  

