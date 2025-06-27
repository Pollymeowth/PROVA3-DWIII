import express from 'express';
import Reserva from '../models/Reserva';
const router = express.Router();

// Página principal
router.get('/', async (req, res) => {
  const reservas = await Reserva.find().lean();
  res.render('index', { reservas });
});

router.post('/reserva', async (req, res) => {
  try {
    const { numeroMesa, dataHora } = req.body;

    const novaHora = new Date(dataHora);
    const horaLimite = new Date(novaHora);
    horaLimite.setHours(22, 0, 0, 0); // 22:00h

    if (novaHora > horaLimite) {
      // renderiza a mesma página com mensagem de erro
      const reservas = await Reserva.find().lean();
      return res.render('index', { 
        reservas, 
        erro: 'Horário inválido: último horário de reserva é às 22h.' 
      });
    }

    // Checar conflito com intervalo de ±2 horas
    const inicioJanela = new Date(novaHora);
    inicioJanela.setHours(novaHora.getHours() - 2);

    const fimJanela = new Date(novaHora);
    fimJanela.setHours(novaHora.getHours() + 2);

    const conflito = await Reserva.findOne({
      numeroMesa,
      status: { $ne: 'Disponivel' }, // só impede se estiver Reservado ou Ocupado
      dataHora: {
        $gte: inicioJanela,
        $lte: fimJanela
      }
    });

    if (conflito) {
      const reservas = await Reserva.find().lean();
      return res.render('index', { 
        reservas, 
        erro: 'Já existe uma reserva para essa mesa nesse horário. Favor escolher outro horário.' 
      });
    }

    await Reserva.create(req.body);
    res.redirect('/');
  } catch (err) {
    const reservas = await Reserva.find().lean();
    res.render('index', { 
      reservas, 
      erro: 'Erro ao criar reserva' 
    });
  }
});

// Atualizar reserva
router.post('/reserva/:id/update', async (req, res) => {
  try {
    console.log('Atualizando reserva:', req.params.id, 'Status:', req.body.status);
    await Reserva.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect('/');
  } catch {
    res.status(400).send('Erro ao atualizar');
  }
});

// Deletar reserva
router.post('/reserva/:id/delete', async (req, res) => {
  try {
    await Reserva.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch {
    res.status(400).send('Erro ao deletar');
  }
});

export default router;