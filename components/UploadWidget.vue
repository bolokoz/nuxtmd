<template>
    <div class="uw">
        <h3>Upload Widget Example</h3>
        <button @click="showUploadWidget()" id="upload_widget" class="cloudinary-button">
            Upload files
        </button>
    </div>
</template>
  
<script>
const widget = process.client.cloudinary.createUploadWidget({
  cloud_name: 'boloko', upload_preset: 'nuxtmd', sources: [
    "local",
    "camera",
    "unsplash"
  ],
  maxImageWidth: 800, //Scales the image down to a width of 2000 pixels before uploading
  defaultSource: "local",
  multiple: true,
  context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
  styles: {
        palette: {
            window: "#000000",
            sourceBg: "#000000",
            windowBorder: "#8E9FBF",
            tabIcon: "#FFFFFF",
            inactiveTabIcon: "#8E9FBF",
            menuIcons: "#2AD9FF",
            link: "#08C0FF",
            action: "#336BFF",
            inProgress: "#00BFFF",
            complete: "#33ff00",
            error: "#EA2727",
            textDark: "#000000",
            textLight: "#FFFFFF"
        },
      },

},
  (error, result) => {
    if (!error && result && result.event === "success") {
      images.value.push(result.info.url)
      console.log("Done! Here is the image info: ", result.info);
    }
  })

function showUploadWidget() {
  //  
  widget.open()
}

</script>