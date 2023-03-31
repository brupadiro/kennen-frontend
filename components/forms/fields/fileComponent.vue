<template>
    <div>
      <div class="d-flex flex-column">
        <label class="font-weight-regular mb-2 text-uppercase text-subtitle-2" :class="labelColor">{{label}}</label>
      </div>
      <v-card class="image-upload d-flex justify-center" @click="selectPhoto()">
        <v-icon size="80" v-if="!imageData">mdi-file-outline</v-icon>
        <img :src="imageData" v-else alt="Image preview" class="preview-image">
      <input type="file" ref="uploadFile" style="display:none;" @change="handleImageUpload" accept="image/*">
      </v-card>
    </div>
  </template>
  
  <script>
    export default {
        props: {
      value: null,
      "label-color":{
        type: String,
        default: "grey--text text--darken-4"
      },
      label: {
        type: String,
        default: ''
      },
    },
      data() {
        return {
          focused: false,
          fieldValue: this.value,
          imageData: null
        };
      },
      created() {
        this.$root.$on('resetFile', () => {
          this.imageData = null;
        })
      },
      methods: {
        selectPhoto(event) {
            this.$refs.uploadFile.click()
        },
        handleImageUpload(event) {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.imageData = e.target.result;
            };
            this.$emit('input', file);
            reader.readAsDataURL(file);
          }
        }
      }
    };
  </script>
  
  <style>
    .image-upload {
      margin-top: 10px;
    }
  
    .image-label {
      cursor: pointer;
      color: #1976d2;
      font-weight: 500;
    }
  
    .image-preview {
      margin-top: 10px;
    }
  
    .preview-image {
      max-width: 100%;
      max-height: 200px;
    }
  </style>
  