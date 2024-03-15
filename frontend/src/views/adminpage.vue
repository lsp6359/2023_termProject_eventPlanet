<!--어드민 패널-->
<template>
  <div>
    <v-row >

      <v-col cols="12">
        <template>
          <showEventTable />
        </template>
      </v-col>
      <v-col cols="12" >
        <template>
          <calendar />
        </template>
      </v-col>
      
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import showEventTable from '../components/ShowEventTable.vue'
import calendar from '../components/Calendar.vue'
export default {
  name: 'adminpage',

  components: {
    showEventTable,
    calendar,
  },
 
}
</script>
