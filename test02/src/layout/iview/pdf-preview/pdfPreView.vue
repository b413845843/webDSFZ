<template>
  <div>
    <h3>pdf</h3>
    <Upload action="/dev/pdf/parse">
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload>
  </div>
</template>

<script>
import './pdfPreView.less'

export default {
  name: 'PdfPreView',
  mounted() {
    this.pdf()
  },
  methods: {
     async pdf() {
  }
  },
 
}
</script>
