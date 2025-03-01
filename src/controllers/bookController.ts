import { Request, Response } from "express";
import { getAllBooks, createBook } from "../services/bookService";
import fs from 'fs';
import path from 'path';

  export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await getAllBooks();

        const booksWithEncodedImages = await Promise.all(books.map(async (book: any) => {
            if (book.img) {
                if (book.img.startsWith('/uploads/')) {
                    const fs = await import('fs');
                    const path = await import('path');
                    const imagePath = path.join(__dirname, '..', book.img);
                    try {
                        const imageBuffer = (await fs).readFileSync(imagePath);
                        const base64Image = imageBuffer.toString('base64');
                        const mimeType = 'image/png';
                        return {
                            ...book,
                            img: `data:${mimeType};base64,${base64Image}`,
                        };
                    } catch (readError) {
                        console.error("Error reading image:", readError);
                        return book;
                    }
                } else {
                    return book;
                }
            } else {
                return book;
            }
        }));

        res.json(booksWithEncodedImages);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
};

// In your bookController.ts

export const addBook = async (req: Request, res: Response) => {
  const { img, category, name, price } = req.body;

  try {
    if (img) {
      const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `${Date.now()}.png`; // Generate a unique filename
      const filePath = path.join(__dirname, '../uploads', filename); // Store in an "uploads" folder

      fs.writeFileSync(filePath, buffer);
      //Store the relative path to the image in the database.
      const book = await createBook({ img: `/uploads/${filename}`, category, name, price });
      res.status(201).json(book);
    } else {
        const book = await createBook({ img, category, name, price });
        res.status(201).json(book);
    }
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({ error: 'Failed to create book' });
  }
};
