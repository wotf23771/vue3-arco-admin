<template>
  <a-upload
      ref="uploadRef"
      class="upload-file-uploader"
      :disabled="disabled"
      :multiple="multiple"
      :limit="limit"
      :draggable="draggable"
      :accept="accept"
      :action="actionURL"
      :headers="headers"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :show-file-list="false"
      :on-before-upload="handleBeforeUpload"
      @error="handleUploadError"
      @exceed-limit="handleExceed"
      @success="handleUploadSuccess"
      @change="handleChange"
  >
    <template #upload-button>
      <slot name="upload-button">
        <a-button type="primary">选取文件</a-button>
      </slot>
    </template>
  </a-upload>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import { computed, nextTick, ref, watch } from "vue";
import { Message } from "@arco-design/web-vue";

const emit = defineEmits(["input", "change"]);
const props = defineProps({
  module: {
    type: String,
    default: "system",
  },
  limit: {
    type: Number,
    default: 100,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // 名称长度限制
  fileLength: {
    type: Number,
    default: 64,
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ["doc", "xls", "ppt", "txt", "pdf"],
  },
  // 是否可多选
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: "",
  },
  // 当前存在的文件列表
  existedFileList: {
    type: Array,
    default: [],
  },
  exceedAutoReplace: { //超出限制自动替换 数量为一个时候
    type: Boolean,
    default: false,
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
});
watch(
    () => props.existedFileList,
    async (val) => {
      await nextTick();
      if (val) {
        fileList.value = props?.existedFileList;
      } else {
        fileList.value = [];
      }
    },
    {
      immediate: true,
    },
);
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const headers = {
  Authorization: "Bearer " + getToken(),
};
const fileList = ref([]);
const actionURL = computed(() => baseUrl + "/system/file/upload?module=" + props.module);

const handleBeforeUpload = (file) => {
  // 校检文件类型
  let fileExtension = "";
  if (file.name.lastIndexOf(".") > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    const isTypeOk = props.fileType?.some((type) => {
      if (file.type.indexOf(type) > -1) {
        return true;
      }
      return !!(fileExtension && fileExtension.indexOf(type) > -1);
    });
    if (!isTypeOk) {
      Message.error(
          `文件格式不正确, 请上传${props.fileType.join("/")}格式文件!`,
      );
      return false;
    }
    // 校检文件大小
    if (props.fileSize) {
      const isSize = file.size < props.fileSize * 1024 * 1024;
      if (!isSize) {
        Message.error(`上传文件大小不能超过 ${props.fileSize} MB!`);
        return false;
      }
    }
    // 校验文件名称
    if (props.fileLength) {
      const isLength = file.name.length <= props.fileLength;
      if (!isLength) {
        Message.error(`附件名称过长，最长允许 ${props.fileLength} 个字!`);
        return false;
      }
    }
    // 校验文件名是否重复
    if (props.checkRepeat) {
      console.log(props.existedFileList);
      console.log(file);
      if (props.existedFileList.find((item) => item.name === file.name)) {
        Message.error("文件名不能重名，请检查后重新上传");
        return false;
      }
    }
    Message.loading("正在上传文件，请稍候...");
    return true;
  } else {
    Message.error(`文件格式不正确, 请上传${props.fileType.join("/")}格式文件!`);
    return false;
  }
};

// 文件个数超出
const handleExceed = () => {
  Message.error(`上传文件数量不能超过 ${props.limit} 个!`);
};

// 上传失败
const handleUploadError = (err) => {
  Message.error("上传失败，请重试");
  Message.clear();
};
const deleteFile = (index) => {
  if (props.disabled) {
    return;
  }
  let array = [...fileList.value];
  array.splice(index, 1);
  fileList.value = [...array];
  emit("input", fileList.value);
};
const uploadRef = ref(null);
// 上传成功回调
const handleUploadSuccess = (res) => {
  if (!res.response.success) {
    Message.error(res.response.message);
    Message.clear();
    return;
  }
  res.response.data.fileId = res.response.data.id;
  res.response.data.id = null;
  if (props.exceedAutoReplace) {
    fileList.value = [res.response.data];
  } else {
    fileList.value.push(res.response.data);
  }

  emit("input", fileList.value);
  Message.clear();
};
const handleChange = (uploadFile) => {
  emit("change", uploadFile);
};
//预览
const handlePreview = async (row) => {
  const fileId = row.fileId ? row.fileId : row.id;
  if (["doc", "docx", "xlsx", "xls", "ppt", "pptx", "wps", "et", "dps", "txt", "pdf", "jpg", "jpeg", "gif", "png", "bmp", "tif", "tiff"].includes(row.ext)) {
    window.open(import.meta.env.VITE_API_BASE_URL + "/preview/preview?fileId=" + fileId + "&t=" + new Date().getTime());
  } else {
    // 直接下载
    window.open(import.meta.env.VITE_API_BASE_URL + "/system/file/download?fileId=" + fileId + "&access_token=" + getToken() + "&t=" + new Date().getTime());
  }
};

defineExpose({ handleBeforeUpload, deleteFile });
</script>

<style scoped lang="less">

</style>
