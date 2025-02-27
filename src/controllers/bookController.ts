import { Request, Response } from "express";
import { getAllBooks, createBook } from "../services/bookService";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const addBook = async (req: Request, res: Response) => {
  const { img, category, name, price } = req.body;
  
  try {
    const book = await createBook({ img, category, name, price: parseFloat(price) });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: "Failed to create book" });
  }
};
