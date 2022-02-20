import mongoose from 'mongoose';

const PersonSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Person', PersonSchema);
