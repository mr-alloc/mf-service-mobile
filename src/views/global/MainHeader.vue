<template>
  <div class="main-header-container">
<!--    <FamilySelector v-if="memberInfoStore.getCurrentAccountRole().isGrantedFrom(AccountRole.MEMBER)" allow-collapse/>-->
    <FamilySelector />
    <ProfilePreview/>
  </div>
</template>
<script setup lang="ts">
import ProfilePreview from '@/components/header/ProfilePreview.vue'
import FamilySelector from '@/components/header/FamilySelector.vue'
</script>

<style scoped lang="scss">
@import "@assets/main";

.main-header-container {
  padding: 5px 8px;
  border-bottom: 1px solid $standard-light-gray-in-white;
  display: flex;
}
</style>
