<template>
  <el-upload
    :action="baseURL + '/api/uploadFile'"
    :headers="{
      // token: state.token,
    }"
    v-loading="loading"
    element-loading-text="loading"
    :class="uploadClassName"
    drag
    ref="uploadRef"
    list-type="picture-card"
    :accept="accept"
    v-model:file-list="fileList"
    :auto-upload="true"
    :limit="limit"
    :before-upload="beforeUpload"
    :on-exceed="onExceed"
    :on-remove="onRemove"
    :on-error="onError"
    :on-progress="onProgress"
    :on-success="onSuccess"
  >
    <el-icon><Plus /></el-icon>
    <template #tip>
      <div class="el-upload__tip">
        {{ accept.replace(/,/g, '/') }}
        <span v-if="size">， file does not exceed {{ size }}M</span>
      </div>
    </template>
    <template #file="{ file }">
      <div v-if="type == 'img'">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.src"
          alt=""
          v-show="file.src"
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
      <span v-if="type == 'audio'">
        <audio
          :src="fileList[0].src"
          style="width: 140px; height: 140px"
          controls
        ></audio>
      </span>
      <span v-if="type == 'video'">
        <video
          style="width: 140px; height: 140px"
          controls
          v-if="fileList[0].src"
        >
          <source :src="fileList[0].src" type="video/mp4" />
          <source :src="fileList[0].src" type="video/mpg" />
          <source :src="fileList[0].src" type="video/MPG" />
          <source :src="fileList[0].src" type="video/MPG" />
          <source :src="fileList[0].src" type="video/MPEG" />
        </video>
      </span>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" class="preViewImg" />
  </el-dialog>
</template>

<script setup lang="ts" name="base-upload">
import { ref, watchEffect } from 'vue';
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue';

import {
  ElMessage,
  genFileId,
  UploadFile,
  UploadInstance,
  UploadRawFile,
} from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus';
// import { useLoginStore } from '@/store/login';

export type UploadListItem = UploadUserFile & {
  src: string;
};

const baseURL: string = import.meta.env.VITE_APP_BASE_URL || '/foreignUnion';

// const { state } = useLoginStore();

type UploadPropsType = {
  accept?: string;
  size?: number;
  limit?: number;
  type: string;
};

const props = withDefaults(defineProps<UploadPropsType>(), {
  accept: 'jpg,png,jpeg',
  limit: 1,
});
const { accept, size, limit, type } = props;
const emit = defineEmits<{
  (event: 'change', data: UploadListItem[]): void;
}>();

// 文件列表
const fileList = ref<UploadListItem[]>([]);
watchEffect(() => {
  // 文件列表发生变化，发出通知
  emit('change', fileList.value);
});
// upload 实例
const uploadRef = ref<UploadInstance>();
const uploadClassName = 'upload_' + new Date().getTime();

// 是否隐藏上传按钮
let elUploadDom = null;
watchEffect(() => {
  elUploadDom = document
    .getElementsByClassName(uploadClassName)[0]
    ?.firstElementChild.getElementsByClassName('el-upload')[0];

  if (limit > 1 && fileList.value.length >= limit) {
    elUploadDom && (elUploadDom.style.display = 'none');
  } else {
    elUploadDom && (elUploadDom.style.display = 'block');
  }
});
// 预览 url
const dialogImageUrl = ref('');
// 预览弹窗状态
const dialogVisible = ref(false);
const loading = ref(false);

// 上传之前校验
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(rawFile);
  if (!accept.split(',').some((type) => rawFile.type.indexOf(type) > -1)) {
    if (
      accept
        .split(',')
        .some((type) => rawFile.name.toLocaleLowerCase().indexOf(type) > -1)
    ) {
      return true;
    }
    loading.value = false;
    ElMessage.warning(`file must be ${accept} format!`);
    return false;
  }
  if (size && rawFile.size / 1024 / 1024 > size) {
    ElMessage.warning(`file size can not exceed ${size}MB!`);
    loading.value = false;
    return false;
  }
  loading.value = true;
  return true;
};

//手动删除
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex((item) => item.uid === file.uid);
  fileList.value.splice(index, 1);
};

const onRemove: UploadProps['onRemove'] = (uploadFile) => {
  console.log(uploadFile);
};

// 超出文件限制
const onExceed: UploadProps['onExceed'] = (files) => {
  if (limit != 1) {
    ElMessage.warning(`Upload up to ${size} files!`);
    return;
  }
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  loading.value = true;
  uploadRef.value.submit();
};

// 上传成功
const onSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
  uploadFiles
) => {
  loading.value = false;
  if (response.code === 1) {
    const index = fileList.value.findIndex(
      (item) => item.uid === uploadFile.uid
    );
    fileList.value.splice(index, 1, {
      ...uploadFile,
      src: response.url,
    });
    ElMessage.success(`${uploadFile.name} upload successfully!`);
  } else {
    handleRemove(uploadFile);
    ElMessage.error(`${uploadFile.name} upload failed`);
  }
};

const onProgress = (evt, uploadFile, uploadFiles) => {
  // console.log(2222, evt);
};

const onError: UploadProps['onError'] = (error, uploadFile) => {
  loading.value = false;
  ElMessage.error(`${uploadFile.name} upload failed, ${error}`);
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
const clearFiles = () => {
  // 清空已上传的文件列表（该方法不支持在 before-upload 中调用）
  uploadRef.value.clearFiles();
};

defineExpose({
  clearFiles,
});
</script>

<style lang="scss" scoped>
.preViewImg {
  max-height: 600px;
  display: block;
  margin: 0 auto;
}
</style>
