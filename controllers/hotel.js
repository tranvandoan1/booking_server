import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Transaction from '../models/Transaction.js';
import { login } from './auth.js';

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  let checkTrue = false;
  const transactions = await Transaction.find({
    hotelId: req.params.id,
  });
  if (transactions.length > 0) {
    checkTrue = transactions.some(tran => tran.status !== 'Checkout');
  }

  if (!checkTrue) {
    try {
      await Hotel.findByIdAndDelete(req.params.id);
      res.status(200).json('Hotel has been deleted!');
    } catch (err) {
      next(err);
    }
  } else {
    res.status(404).json('This Hotel is currently booked !');
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, maxPeople, room, dates, city, ...others } = req.query;

  if (room) {
    try {
      const rooms = await Room.find({
        maxPeople: { $gte: Number(maxPeople) },
      });
      const roomsId = rooms.map(room => room._id.toString());

      const hotels = await Hotel.find({
        city: { $all: [city] },
        rooms: { $in: roomsId },
        cheapestPrice: { $gt: min | 1, $lt: max || 999 },
      });

      const listHotels = hotels.filter(
        hotel => hotel.rooms.length >= Number(room)
      );

      res.status(200).json(listHotels);
    } catch (err) {
      next(err);
    }
  } else {
    try {
      const hotels = await Hotel.find({
        ...others,
        cheapestPrice: { $gt: min | 1, $lt: max || 999 },
      });
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(',');
  try {
    const list = await Promise.all(
      cities.map(city => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: 'hotel' });
    const apartmentCount = await Hotel.countDocuments({ type: 'apartment' });
    const resortCount = await Hotel.countDocuments({ type: 'resort' });
    const villaCount = await Hotel.countDocuments({ type: 'villa' });
    const cabinCount = await Hotel.countDocuments({ type: 'cabin' });

    res.status(200).json([
      { type: 'hotel', count: hotelCount },
      { type: 'apartments', count: apartmentCount },
      { type: 'resorts', count: resortCount },
      { type: 'villas', count: villaCount },
      { type: 'cabin', count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map(room => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
