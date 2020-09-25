import mongoose from 'mongoose';

const ContatoSchema = new mongoose.Schema(

   {
      contacts: [
        {
           displayName: { type: String, max: 100},
           phoneNumbers:{ type: Array, default: [] },
           recordID: { type: Number, required: true }
        }
    ],
    user: {
      type: Number,
      required: true,
    },
   }

);

export default mongoose.model('Contato', ContatoSchema);
