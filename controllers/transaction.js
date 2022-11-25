import Transaction from '../models/Transaction.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

export const createTransaction = async (req, res, next) => {
  const hotel = await Hotel.find({ _id: req.body.hotelId });

  const newTransaction = new Transaction({ ...req.body, hotel: hotel[0].name });
  try {
    const savedTransaction = await newTransaction.save();
    res.status(200).json(savedTransaction);
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

export const getTransactionsUser = async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.user.id });
    const transactions = await Transaction.find({
      username: user[0].username,
    });
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};
