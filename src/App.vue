<script setup lang="ts" nam="i-can-use"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component
        :is="Component"
        :key="route.name"
        v-if="route.meta.keepAlive"
      />
    </keep-alive>
    <component :is="Component" :key="route.name" v-if="!route.meta.keepAlive" />
  </router-view>
</template>

<style scoped></style>
