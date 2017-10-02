import { Random } from 'meteor/random';

Slingshot.fileRestrictions("uploadToS3", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/quicktime"],
  maxSize: 1 * 1024 * 40400,
});

Slingshot.createDirective("uploadToS3", Slingshot.S3Storage, {
  bucket: "learn-map",
  authorize() {
    if (this.userId) return true;
    return false;
    // let userFileCount = Files.find( { "userId": this.userId } ).count();
    // return userFileCount < 3 ? true : false;
    // return true
  },
  key(file) {
    // Create new filename with added Random ID
    const index = file.name.lastIndexOf('.');
    const addId = [file.name.substring(0, index), '-', Random.id(20), file.name.substring(index)].join('');

    const user = Meteor.users.findOne(this.userId);
    return `${user._id}/${addId}`;
  },
});
