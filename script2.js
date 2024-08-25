document.addEventListener('DOMContentLoaded', function() {

    // Variables específicas para el segundo cotizador
    const fechaInicialInput2 = document.getElementById('desde2');
    const diasInput2 = document.getElementById('dias2');
    const fechaFinalInput2 = document.getElementById('hasta2');
    const valorContratoInput2 = document.getElementById('valorContrato2');

    const garantiaSelects2 = document.querySelectorAll('select[name="garantia2"]');
    const garantiaInputs2 = document.querySelectorAll('input[name^="fechaInicialGarantia2"]');
    const diasGarantiaInputs2 = document.querySelectorAll('input[name^="diasGarantia2"]');
    const fechaFinalGarantiaInputs2 = document.querySelectorAll('input[name^="fechaFinalGarantia2"]');
    const porcentajeInputs2 = document.querySelectorAll('input[name^="porcentaje2"]');
    const valorGarantiaInputs2 = document.querySelectorAll('input[name^="valorGarantia2"]');
    const tasaInputs2 = document.querySelectorAll('input[name^="tasa2"]');
    const primaInputs2 = document.querySelectorAll('input[name^="prima2"]');

    const totalPrimaInput2 = document.getElementById('totalPrima2');
    const gastosExpedicionInput2 = document.getElementById('gastosExpedicion2');
    const ivaInput2 = document.getElementById('iva2');
    const totalConIvaInput2 = document.getElementById('total2');

    const maxValorContrato2 = 500000000;
    const MIN_VALOR_RESPONSABILIDAD = 50000000; // Valor mínimo para responsabilidadCivil
    
    garantiaSelects2.forEach((select, index) => {
        select.addEventListener('change', function() {
            if (this.value !== '') {
                // Configurar valores iniciales según la garantía seleccionada
                switch (this.value) {
                    case 'cumplimiento':
                        tasaInputs2[index].value = 0.20;
                        tasaInputs2[index].readOnly = true;
                        porcentajeInputs2[index].value = 20;
                        porcentajeInputs2[index].readOnly = true;
                        diasGarantiaInputs2[index].value = 45;
                        diasGarantiaInputs2[index].readOnly = true;
                        break;
                    case 'calidadServicio':
                        tasaInputs2[index].value = 0.20;
                        tasaInputs2[index].readOnly = true;
                        porcentajeInputs2[index].value = 30;
                        porcentajeInputs2[index].readOnly = true;
                        diasGarantiaInputs2[index].value = 180;
                        diasGarantiaInputs2[index].readOnly = true;
                        break;
                    case 'salarios':
                        tasaInputs2[index].value = 0.20;
                        tasaInputs2[index].readOnly = true;
                        porcentajeInputs2[index].value = 15;
                        porcentajeInputs2[index].readOnly = true;
                        diasGarantiaInputs2[index].value = 1095;
                        diasGarantiaInputs2[index].readOnly = true;
                        break;
                    case 'responsabilidadCivil':
                        tasaInputs2[index].value = 0.30;
                        tasaInputs2[index].readOnly = true;
                        porcentajeInputs2[index].value = 30;
                        porcentajeInputs2[index].readOnly = true;
                        diasGarantiaInputs2[index].value = 90;
                        diasGarantiaInputs2[index].readOnly = true;
                        break;
                }
                // Calcular y actualizar todos los valores relacionados con la garantía
                calcularFechaFinalGarantia(index);
                calcularValorGarantia(index);
                calcularPrima(index);  // Asegurarse de recalcular la prima después de configurar los valores
            } else {
                deseleccionarGarantia(index);
            }
        });
    });

    function deseleccionarGarantia(index) {
        // Limpiar los cálculos relacionados con la garantía deseleccionada
        garantiaInputs2[index].value = '';
        diasGarantiaInputs2[index].value = '';
        fechaFinalGarantiaInputs2[index].value = '';
        porcentajeInputs2[index].value = '';
        valorGarantiaInputs2[index].value = '';
        tasaInputs2[index].value = '';
        primaInputs2[index].value = '';
    
        // Rehabilitar los campos para que se puedan volver a calcular
        tasaInputs2[index].readOnly = false;
        porcentajeInputs2[index].readOnly = false;
        diasGarantiaInputs2[index].readOnly = false;
    
        recalcularPrimaTotal(); // Recalcular la prima total
    }
    
    // Función para validar y limitar el valor del contrato
    function validarValorContrato() {
        let valor = parseFloat(valorContratoInput2.value);
        if (isNaN(valor) || valor > maxValorContrato2) {
            valorContratoInput2.value = maxValorContrato2;
            alert(`El valor del contrato no puede ser mayor a ${maxValorContrato2.toLocaleString()}`);
        }
    }

    function calcularFechaFinal() {
        const fechaInicial = new Date(fechaInicialInput2.value);
        const dias = parseInt(diasInput2.value);
        if (!isNaN(fechaInicial) && !isNaN(dias)) {
            const fechaFinal = new Date(fechaInicial);
            fechaFinal.setDate(fechaFinal.getDate() + dias);
            fechaFinalInput2.value = fechaFinal.toISOString().split('T')[0];
            actualizarFechasFinalGarantia();
        }
    }

    function calcularDias() {
        const fechaInicial = new Date(fechaInicialInput2.value);
        const fechaFinal = new Date(fechaFinalInput2.value);
        if (!isNaN(fechaInicial) && !isNaN(fechaFinal)) {
            const diferenciaTiempo = fechaFinal - fechaInicial;
            const dias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
            diasInput2.value = dias;
        }
    }

    function calcularDiasEntreFechas(fechaInicial, fechaFinal) {
        const diferenciaTiempo = fechaFinal - fechaInicial;
        return Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
    }

    function calcularFechaFinalGarantia(index) {
        const fechaFinalContrato = new Date(fechaFinalInput2.value);
        const diasGarantia = parseInt(diasGarantiaInputs2[index].value);
        if (!isNaN(fechaFinalContrato) && !isNaN(diasGarantia)) {
            const fechaFinalGarantia = new Date(fechaFinalContrato);
            fechaFinalGarantia.setDate(fechaFinalGarantia.getDate() + diasGarantia);
            fechaFinalGarantiaInputs2[index].value = fechaFinalGarantia.toISOString().split('T')[0];
        }
    }

    function actualizarFechasFinalGarantia() {
        fechaFinalGarantiaInputs2.forEach((input, index) => {
            calcularFechaFinalGarantia(index);
        });
    }

    // Calcular el valor de la garantía
    function calcularValorGarantia(index) {
        const valorContrato = parseFloat(valorContratoInput2.value) || 0;
        const porcentaje = parseFloat(porcentajeInputs2[index].value) || 0;

        // Calcular el valor de la garantía basado en el porcentaje
        let valorGarantia = Math.round((valorContrato * porcentaje) / 100);

        // Excepción para responsabilidadCivil
        if (garantiaSelects2[index].value === "responsabilidadCivil") {
            valorGarantia = Math.max(valorGarantia, MIN_VALOR_RESPONSABILIDAD);
        }

        valorGarantiaInputs2[index].value = valorGarantia;
        calcularPrima(index);
    }

    function recalcularGarantia(index) {
        // Calcular el valor y la prima de la garantía seleccionada
        calcularValorGarantia(index);
        calcularPrima(index);
    }

    function calcularPrima(index) {
        const valorGarantia = parseFloat(valorGarantiaInputs2[index].value) || 0;
        const tasa = parseFloat(tasaInputs2[index].value) || 0;
    
        // Obtener las fechas correctas de la garantía seleccionada
        const fechaInicialGarantia = new Date(fechaInicialInput2.value);
        const fechaFinalGarantia = new Date(fechaFinalGarantiaInputs2[index].value);
    
        if (!isNaN(fechaInicialGarantia) && !isNaN(fechaFinalGarantia) && valorGarantia > 0 && tasa > 0) {
            const dias = calcularDiasEntreFechas(fechaInicialGarantia, fechaFinalGarantia);
    
            // Calcular la prima ajustada por el número de días en el año
            const prima = Math.round((valorGarantia * (tasa / 100)) * (dias / 365));
            primaInputs2[index].value = prima;
            actualizarTotalPrima(); // Recalcular el total de la prima
        }
    }

    function actualizarTotalPrima() {
        let totalPrima = 0;
        primaInputs2.forEach(input => {
            totalPrima += parseFloat(input.value) || 0;
        });
    
        // Ajuste si el total prima es menor que 80,000
        if (totalPrima < 75000) {
            totalPrima = 80000;
        }
    
        totalPrimaInput2.value = totalPrima;
        calcularIVA(); // Recalcular IVA cuando cambia el total de la prima
    }
    
    function recalcularPrimaTotal() {
        // Recalcular la prima total después de deseleccionar una garantía
        let totalPrima = 0;
        primaInputs2.forEach(input => {
            totalPrima += parseFloat(input.value) || 0;
        });

        // Ajuste si el total prima es menor que 80,000
        if (totalPrima < 75000) {
            totalPrima = 80000;
        }

        totalPrimaInput2.value = totalPrima;
        calcularIVA(); // Recalcular IVA cuando cambia el total de la prima
    }

    function calcularIVA() {
        const totalPrima = parseFloat(totalPrimaInput2.value) || 0;
        const gastosExpedicion = parseFloat(gastosExpedicionInput2.value) || 0;
        const iva = Math.round((totalPrima + gastosExpedicion) * 0.16); // Calcula el IVA (16%)
        ivaInput2.value = iva;
        calcularTotal(); // Recalcular el total después de calcular el IVA
    }
    
    function calcularTotal() {
        const totalPrima = parseFloat(totalPrimaInput2.value) || 0;
        const gastosExpedicion = parseFloat(gastosExpedicionInput2.value) || 0;
        const iva = parseFloat(ivaInput2.value) || 0;
        const total = totalPrima + gastosExpedicion + iva;
        totalConIvaInput2.value = total;
    }
    
    // Event Listeners para recalcular los valores

    // Eventos con debounce
    valorContratoInput2.addEventListener('input', validarValorContrato);

    fechaInicialInput2.addEventListener('input', function() {
        garantiaInputs2.forEach(input => input.value = this.value);
        calcularFechaFinal();
    });

    diasInput2.addEventListener('input', calcularFechaFinal);
    fechaFinalInput2.addEventListener('input', function() {
        calcularDias();
        actualizarFechasFinalGarantia();
    });

    garantiaSelects2.forEach((select, index) => {
        select.addEventListener('change', function() {
            if (this.value !== '') {
                recalcularGarantia(index);
            } else {
                deseleccionarGarantia(index);
            }
        });
    });

    valorContratoInput2.addEventListener('input', function() {
        garantiaSelects2.forEach((_, index) => calcularValorGarantia(index));
    });

});
