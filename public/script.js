let operacionActual = 'suma';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de operación
    const opButtons = document.querySelectorAll('.op-btn');
    opButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            opButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            // Actualizar operación actual
            operacionActual = this.dataset.operation;
            // Actualizar interfaz según la operación
            actualizarInterfaz();
        });
    });

    // Configurar formulario
    document.getElementById('calcForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calcular();
    });

    // Inicializar interfaz
    actualizarInterfaz();
});

function actualizarInterfaz() {
    const num2Group = document.getElementById('num2Group');
    const num2Input = document.getElementById('num2');
    const num1Label = document.querySelector('label[for="num1"]');

    if (operacionActual === 'raiz') {
        // Para raíz cuadrada, solo mostrar un campo
        num2Group.style.display = 'none';
        num1Label.textContent = 'Número:';
        num2Input.required = false;
    } else {
        // Para otras operaciones, mostrar ambos campos
        num2Group.style.display = 'block';
        num1Label.textContent = 'Primer número:';
        num2Input.required = true;
        
        // Actualizar etiquetas según la operación
        const num2Label = document.querySelector('label[for="num2"]');
        if (operacionActual === 'division') {
            num2Label.textContent = 'Divisor:';
        } else if (operacionActual === 'potencia') {
            num2Label.textContent = 'Exponente:';
        } else {
            num2Label.textContent = 'Segundo número:';
        }
    }
}

async function calcular() {
    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;

    // Mostrar loading
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.textContent = 'Calculando...';
    calculateBtn.disabled = true;

    try {
        const response = await fetch('/api/calcular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operacion: operacionActual,
                num1: num1,
                num2: operacionActual === 'raiz' ? null : num2
            })
        });

        const data = await response.json();

        if (data.success) {
            mostrarResultado(data.expresion, data.resultado);
        } else {
            mostrarError(data.error);
        }

    } catch (error) {
        mostrarError('Error de conexión: ' + error.message);
    } finally {
        // Restaurar botón
        calculateBtn.textContent = 'Calcular';
        calculateBtn.disabled = false;
    }
}

function mostrarResultado(expresion, resultado) {
    document.getElementById('expression').textContent = expresion + ' =';
    document.getElementById('result').textContent = resultado;
    
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('errorSection').style.display = 'none';
}

function mostrarError(mensaje) {
    document.getElementById('errorMessage').textContent = mensaje;
    document.getElementById('errorSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
}

function clearForm() {
    document.getElementById('calcForm').reset();
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
}