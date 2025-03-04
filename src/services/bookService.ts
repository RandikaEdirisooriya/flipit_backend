import bookModel from "../models/bookModel";

export const getAllBooks = async () => {
  return await bookModel.findMany();
};

export const createBook = async (data: { img: string; category: string; name: string; price: string }) => {
  return await bookModel.create({ data });
};
