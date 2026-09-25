const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
const Quote = mongoose.models.Quote || mongoose.model('Quote', new mongoose.Schema({}, { strict: false }));
const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({}, { strict: false }));
async function update() {
  await Quote.updateMany({ name: /Joshua Afolabi/i }, { $set: { avatarUrl: '/joshua-avatar.png' } });
  await Post.updateMany({ author: /Joshua Afolabi/i }, { $set: { authorAvatar: '/joshua-avatar.png' } });
  console.log('Done');
  process.exit(0);
}
update();
