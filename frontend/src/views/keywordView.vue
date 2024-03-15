<!--키워드 검색-->
<template>
  <div>
    <template>
      <KeywordSearch />
    </template>

    <template>
      <google />
    </template>
  </div>
</template>
  
<script>

import KeywordSearch from '@/components/KeywordSearch.vue'
//구글맵

import google from '@/components/GoogleMap.vue'
export default {
  name: 'key_Detail',
  components: {
    KeywordSearch,
    google,
  },
}
</script>
  

