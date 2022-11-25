import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    ref: 'User',
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Hotel',
  },
  hotel: {
    type: String,
    require: true,
    ref: 'Hotel',
  },
  room: {
    type: [
      {
        type: {
          roomNumber: Number,
          _id: Schema.Types.ObjectId,
        },
      },
    ],
    require: true,
  },
  dateStart: {
    type: Date,
    require: true,
  },
  dateEnd: {
    type: Date,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  payment: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});

export default mongoose.model('Transaction', TransactionSchema);
