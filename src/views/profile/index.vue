<template>
  <div class="app-container" id="container">
    <ProfileCard />
    <ProfileChange />
  </div>
</template>

<script>
import ProfileCard from './components/ProfileCard'
import ProfileChange from './components/ProfileChange'
export default {
  name: 'Profile',
  components: {
    ProfileCard,
    ProfileChange
  }
}
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  align-items: top;
}
</style>