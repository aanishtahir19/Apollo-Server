import mongoose from 'mongoose';

export default async function connect() {
  try {
    await mongoose.connect('mongodb://mongo:27017/myapp');
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.log('Erro ao conectar no MongoDB', error);
  }
}
