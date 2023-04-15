var mongoose = require('mongoose');

var rafSchema = new mongoose.Schema(
    {
      mediaId: Number,
      license: Number,
      licenseName: String,
      applicant: String,
      usage: String,
      dateOfUse: String,
      applicantAddress: String,
      approverAddress: String,
      status: Number,
      hash: {
        type: String,
        unique: true
      },
      applicationSignature: String,
      approverSignature: String,
    });
/*{
    mediaId: 'xxx2',
    license: 'License 2',
    applicant: 'Applicant 2',
    usage: 'Usage 2',
    dateOfUse: '2022-01-11 - 2022-02-01',
  }
 */
module.exports = mongoose.model("raf", rafSchema);