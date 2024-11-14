<script setup>
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, unref, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { isNumber } from "@/utils/is";
import { getToken } from "@/utils/auth";
import { Message } from "@arco-design/web-vue";

const props = defineProps({
  editorId: "wangeEditor-1",
  height: "260px",
  editorConfig: {
    type: Object,
    default: () => undefined,
  },
  toolbarConfig: {
    type: Object,
    default: () => {
    },
  },
  module: {
    type: String,
    default: "system",
  },
  modelValue: "",
});
const emit = defineEmits(["change", "update:modelValue"]);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const valueHtml = ref("");
watch(
    () => props.modelValue,
    (val) => {
      if (val === unref(valueHtml)) return;
      valueHtml.value = val;
    },
    {
      immediate: true,
    },
);

// 监听
watch(
    () => valueHtml.value,
    (val) => {
      emit("update:modelValue", val);
    },
);

const handleCreated = (editor) => {
  editorRef.value = editor;
};

// 编辑器配置
const editorConfig = computed(() => {
  return Object.assign(
      {
        readOnly: false,
        customAlert: (s, t) => {
          switch (t) {
            case "success":
              Message.success(s);
              break;
            case "info":
              Message.info(s);
              break;
            case "warning":
              Message.warning(s);
              break;
            case "error":
              Message.error(s);
              break;
            default:
              Message.info(s);
              break;
          }
        },
        autoFocus: false,
        scroll: true,
        uploadImgShowBase64: true,
        MENU_CONF: {
          //上传参考https://www.wangeditor.com/v5/menu-config.html#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE
          uploadImage: {
            server: `${import.meta.env.VITE_API_BASE_URL}/system/file/upload?module=${props.module}`,
            // 超时时间，默认为 10 秒
            timeout: 30 * 1000, // 5s
            fieldName: "file",
            // 将 meta 拼接到 url 参数中，默认 false
            metaWithUrl: false, // join params to url
            // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
            meta: { dataKey: 0, bizType: "common" },
            // 自定义增加 http  header
            // headers: {
            //   Accept: "text/x-json",
            //   otherKey: "xxx"
            // },
            // 跨域是否传递 cookie ，默认为 false
            withCredentials: true,
            // 自定义增加 http  header
            headers: {
              Authorization: "Bearer " + getToken(),
            },
            maxFileSize: 10 * 1024 * 1024, // 10M
            base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: ["image/*"],
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 30,
            customInsert(res, insertFn) {
              let url = `${import.meta.env.VITE_API_BASE_URL}/system/file/download?fileId=${res.data.id}&access_token=${getToken()}`;
              insertFn(url, "", "");
            },
            onBeforeUpload(file) {
              console.log("onBeforeUpload", file);
              return file; // will upload this file
            },
            onProgress(progress) {
              console.log("onProgress", progress);
            },
            onSuccess(file, res) {
              console.log("onSuccess", file, res);
            },
            onFailed(file, res) {
              console.log("onFailed", file, res);
            },
            onError(file, err, res) {
              console.error("onError", file, err, res);
            },
          },
          uploadVideo: {
            server: `${import.meta.env.VITE_API_BASE_URL}/system/file/upload?module=${props.module}`,
            fieldName: "file",
            // 单个文件的最大体积限制，默认为 10M
            maxFileSize: 50 * 1024 * 1024, // 5M
            // 最多可上传几个文件，默认为 5
            maxNumberOfFiles: 5,
            // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
            allowedFileTypes: ["video/*"],
            // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
            meta: { dataKey: 0, bizType: "video" },
            // 将 meta 拼接到 url 参数中，默认 false
            metaWithUrl: false,
            // 自定义增加 http  header
            // headers: {
            //   Accept: "text/x-json",
            //   otherKey: "xxx"
            // },
            // 跨域是否传递 cookie ，默认为 false
            withCredentials: true,
            headers: {
              Authorization: "Bearer " + getToken(),
            },
            // 超时时间，默认为 30 秒
            timeout: 30 * 1000, // 15 秒
            customInsert(res, insertFn) {
              let url = `${import.meta.env.VITE_API_BASE_URL}/system/file/download?fileId=${res.data.id}&access_token=${getToken()}`;
              insertFn(url, "");
            },
            // 上传进度的回调函数
            onProgress(progress) {
              console.log("progress", progress);
            },
            // 单个文件上传成功之后
            onSuccess(file, res) {
              console.log(`${file.name} 上传成功`, res);
            },
            // 单个文件上传失败
            onFailed(file, res) {
              console.log(`${file.name} 上传失败`, res);
            },
            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
              console.log(`${file.name} 上传出错`, err, res);
            },
          },
        },
      },
      props.editorConfig || {},
  );
});
const toolbarConfig = computed(() => {
  return Object.assign({}, props.toolbarConfig || {});
});

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height,
  };
});

// 回调函数
const handleChange = (editor) => {
  emit("change", editor);
};

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value);
  if (editor === null) return;

  // 销毁，并移除 editor
  editor?.destroy();
});

const getEditorRef = async () => {
  await nextTick();
  return unref(editorRef.value);
};

defineExpose({
  getEditorRef,
});
</script>

<template>
  <div class="editor-container">
    <!-- 工具栏 -->
    <Toolbar
        :defaultConfig="toolbarConfig"
        :editor="editorRef"
        :editorId="editorId"
        class="editor-container-toolbar"
    />
    <!-- 编辑器 -->
    <Editor
        v-model="valueHtml"
        :editorId="editorId"
        :defaultConfig="editorConfig"
        :style="editorStyle"
        @on-change="handleChange"
        @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="less" scoped>
.editor-container {
  border: 1px solid #eee;
}

.editor-container-toolbar {
  border-bottom: 1px solid #eee;
}
</style>
