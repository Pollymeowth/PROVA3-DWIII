import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  numeroMesa: { type: Number, required: true },
  dataHora: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Reservado', 'Ocupado', 'Disponivel'],
    default: 'Reservado'
  },
  contatoCliente: { type: String, required: true }
});

export default mongoose.model('Reserva', reservaSchema);