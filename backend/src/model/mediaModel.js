var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var mediaSchema = new mongoose.Schema(
    {
      nftAddress: String,
      nftTokenId: String,
      oscAddress: String,
      cachedMetadata: String
    });

mediaSchema.plugin(autoIncrement.plugin, { model: 'media', field: 'mediaId' });
module.exports = mongoose.model("media", mediaSchema);