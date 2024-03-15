<!--일반유저가 보는 캘린더-->
<template>
    <div>
        <template>
            <calendar />
        </template>
        <template>
            <EventAPI />
        </template>
    </div>
</template>
  
<script>
import calendar from '../components/Calendar2.vue'
import EventAPI from '../components/EventAPI.vue'
export default {
    name: 'calendar2',

    components: {
        calendar,
        EventAPI
    },
}
</script>
  