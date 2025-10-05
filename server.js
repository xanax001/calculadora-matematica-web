const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Funciones matemáticas (las mismas que tenías)
function suma(a, b) {
  return a + b;
}

function resta(a, b) {
  return a - b;
}

function multiplicacion(a, b) {
  return a * b;
}

function division(a, b) {
  if (b === 0) {
    throw new Error('No se puede dividir entre cero');
  }
  return a / b;
}

function potencia(base, exponente) {
  return Math.pow(base, exponente);
}

function raizCuadrada(numero) {
  if (numero < 0) {
    throw new Error('No se puede calcular la raíz de un número negativo');
  }
  return Math.sqrt(numero);
}

// Rutas de la API
app.post('/api/calcular', (req, res) => {
  const { operacion, num1, num2 } = req.body;
  
  try {
    let resultado;
    let expresion;

    // Validar que los números sean válidos
    const numero1 = parseFloat(num1);
    const numero2 = num2 ? parseFloat(num2) : null;

    if (isNaN(numero1) || (num2 && isNaN(numero2))) {
      throw new Error('Por favor, ingresa números válidos');
    }

    switch (operacion) {
      case 'suma':
        resultado = suma(numero1, numero2);
        expresion = `${numero1} + ${numero2}`;
        break;

      case 'resta':
        resultado = resta(numero1, numero2);
        expresion = `${numero1} - ${numero2}`;
        break;

      case 'multiplicacion':
        resultado = multiplicacion(numero1, numero2);
        expresion = `${numero1} × ${numero2}`;
        break;

      case 'division':
        resultado = division(numero1, numero2);
        expresion = `${numero1} ÷ ${numero2}`;
        break;

      case 'potencia':
        resultado = potencia(numero1, numero2);
        expresion = `${numero1}^${numero2}`;
        break;

      case 'raiz':
        resultado = raizCuadrada(numero1);
        expresion = `√${numero1}`;
        break;

      default:
        throw new Error('Operación no válida');
    }

    res.json({
      success: true,
      resultado: resultado,
      expresion: expresion,
      operacion: operacion
    });

  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('🧮 Sistema de Operaciones Matemáticas Web');
});