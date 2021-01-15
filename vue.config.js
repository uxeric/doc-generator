module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/lib/docx-generator.js',
      builderOptions: {
        productName: "Camila's Future",
      },
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
