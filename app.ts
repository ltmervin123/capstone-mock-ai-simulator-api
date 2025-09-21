import express, { Request, Response, Application } from 'express';
import 'dotenv/config';
import cors from 'cors';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
  res.send('Backend is running!');
});

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
