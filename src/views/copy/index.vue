<template>
  <button
    @click="() => copyHandler()"
    ref="CopyRef"
    :data-clipboard-text="Address"
  >
    copy
  </button>
</template>

<script setup lang="ts" name="copy">
import { useCopy, Address, initClipboardJS, destroy } from './index';
const { CopyStatus, CopyRef, copyHandler } = useCopy();
</script>

<style lang="scss" scoped></style>
