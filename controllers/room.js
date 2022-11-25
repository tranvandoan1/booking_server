import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import { login } from './auth.js';

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = new Room(req.body);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { 'roomNumbers._id': req.params.id },
      {
        $push: {
          'roomNumbers.$.unavailableDates': req.body.dates,
        },
      }
    );
    res.status(200).json('Room status has been updated.');
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  let check = false;
  const toDay = new Date();
  const room = await Room.findById(req.params.id);
  room.roomNumbers.map(roomNumber => {
    const indexDateEnd = roomNumber.unavailableDates.length - 1;
    if (
      indexDateEnd === -1 ||
      roomNumber.unavailableDates[indexDateEnd].getTime() < toDay.getTime()
    ) {
      check = true;
      return;
    }
  });
  if (check) {
    try {
      await Room.findByIdAndDelete(req.params.id);

      try {
        const hotel = await Hotel.findOne({ rooms: { $in: [req.params.id] } });
        await Hotel.findByIdAndUpdate(hotel._id, {
          $pull: { rooms: req.params.id },
        });
      } catch (err) {
        next(err);
      }
      res.status(200).json('Room has been deleted!');
    } catch (err) {
      next(err);
    }
  } else {
    res.status(404).json('This room is currently booked !');
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
