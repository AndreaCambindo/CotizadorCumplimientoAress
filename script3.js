document.addEventListener('DOMContentLoaded', function() {

    // Variables específicas para el tercer cotizador
    const fechaInicialInput3 = document.getElementById('desde3');
    const diasInput3 = document.getElementById('dias3');
    const fechaFinalInput3 = document.getElementById('hasta3');
    const valorContratoInput3 = document.getElementById('valorContrato3');

    const garantiaSelects3 = document.querySelectorAll('select[name="garantia3"]');
    const garantiaInputs3 = document.querySelectorAll('input[name^="fechaInicialGarantia3"]');
    const diasGarantiaInputs3 = document.querySelectorAll('input[name^="diasGarantia3"]');
    const fechaFinalGarantiaInputs3 = document.querySelectorAll('input[name^="fechaFinalGarantia3"]');
    const porcentajeInputs3 = document.querySelectorAll('input[name^="porcentaje3"]');
    const valorGarantiaInputs3 = document.querySelectorAll('input[name^="valorGarantia3"]');
    const tasaInputs3 = document.querySelectorAll('input[name^="tasa3"]');
    const primaInputs3 = document.querySelectorAll('input[name^="prima3"]');

    const totalPrimaInput3 = document.getElementById('totalPrima3');
    const gastosExpedicionInput3 = document.getElementById('gastosExpedicion3');
    const ivaInput3 = document.getElementById('iva3');
    const totalConIvaInput3 = document.getElementById('total3');

    const maxValorContrato3 = 500000000;
    const MIN_VALOR_RESPONSABILIDAD = 50000000; // Valor mínimo para responsabilidadCivil
    
    garantiaSelects3.forEach((select, index) => {
        select.addEventListener('change', function() {
            if (this.value === 'otro') {
                // Convertir el campo select en un campo de texto
                let input = document.createElement('input');
                input.type = 'text';
                input.name = select.name; // Mantener el mismo nombre para el input
                input.className = select.className; // Mantener la misma clase
                input.placeholder = 'Ingrese el nombre de la garantía';
                select.replaceWith(input); // Reemplazar el select por el input
    
                // Configurar valores fijos para "Otro"
                tasaInputs3[index].value = 0.20; // Valor fijo
                tasaInputs3[index].readOnly = true;
                porcentajeInputs3[index].value = 30; // Valor fijo
                porcentajeInputs3[index].readOnly = 30; // Valor fijo
    
                // Crear un nuevo select para los días
                let selectDias = document.createElement('select');
                selectDias.name = `diasGarantiaOtro${index}`;
                selectDias.className = diasGarantiaInputs3[index].className;
    
                // Añadir opciones de días
                let opcionesDias = [0, 30, 60, 90, 120, 180]; // Puedes agregar más opciones aquí
                opcionesDias.forEach(dias => {
                    let option = document.createElement('option');
                    option.value = dias;
                    option.text = `${dias}`;
                    selectDias.appendChild(option);
                });
    
                // Reemplazar el input de días con el nuevo select
                diasGarantiaInputs3[index].replaceWith(selectDias);
    
                // Escuchar cuando se seleccione una opción de días
                selectDias.addEventListener('change', function() {
                    diasGarantiaInputs3[index].value = this.value; // Actualizar el valor de días
                    calcularFechaFinalGarantia(index); // Calcular la fecha final de la garantía
                    calcularValorGarantia(index); // Calcular el valor de la garantía
                    calcularPrima(index); // Calcular la prima
                });
    
                // Escuchar cuando se salga del campo de texto
                input.addEventListener('blur', function() {
                    // Si el campo queda vacío, se convierte de nuevo en un select
                    if (this.value.trim() === '') {
                        revertirInputASelect(input, index);
                    }
                });
    
            } else if (this.value !== '') {
                // Configurar valores iniciales según la garantía seleccionada
                configurarValoresGarantia(this.value, index);
                calcularFechaFinalGarantia(index);
                calcularValorGarantia(index);
                calcularPrima(index);
            } else {
                deseleccionarGarantia(index);
            }
        });
    });

    function revertirInputASelect(input, index) {
        let newSelect = document.createElement('select');
        newSelect.name = input.name;
        newSelect.className = input.className;

        newSelect.innerHTML = `
            <option value="">Seleccione una garantía</option>
            <option value="cumplimiento">Cumplimiento</option>
            <option value="calidadServicio">Calidad del servicio</option>
            <option value="salarios">Salarios y prestaciones sociales</option>
            <option value="responsabilidadCivil">Responsabilidad Civil</option>
            <option value="otro">Otro</option>
        `;

        // Reemplazar el input con el nuevo select
        input.replaceWith(newSelect);

        // Volver a agregar el evento de cambio al nuevo select
        newSelect.addEventListener('change', function() {
            if (this.value === 'otro') {
                let otroInput = document.createElement('input');
                otroInput.type = 'text';
                otroInput.name = newSelect.name;
                otroInput.className = newSelect.className;
                otroInput.placeholder = 'Ingrese el nombre de la garantía';
                newSelect.replaceWith(otroInput);
                configurarValoresGarantiaOtro(index, otroInput);
            } else if (this.value !== '') {
                configurarValoresGarantia(this.value, index);
                calcularFechaFinalGarantia(index);
                calcularValorGarantia(index);
                calcularPrima(index);
            } else {
                deseleccionarGarantia(index);
            }
        });
    }

    function configurarValoresGarantia(garantia, index) {
        switch (garantia) {
            case 'cumplimiento':
                tasaInputs3[index].value = 0.20;
                tasaInputs3[index].readOnly = true;
                porcentajeInputs3[index].value = 25;
                porcentajeInputs3[index].readOnly = true;
                diasGarantiaInputs3[index].value = 30;
                diasGarantiaInputs3[index].readOnly = true;
                break;
            case 'calidadServicio':
                tasaInputs3[index].value = 0.20;
                tasaInputs3[index].readOnly = true;
                porcentajeInputs3[index].value = 30;
                porcentajeInputs3[index].readOnly = true;
                diasGarantiaInputs3[index].value = 365;
                diasGarantiaInputs3[index].readOnly = true;
                break;
            case 'salarios':
                tasaInputs3[index].value = 0.20;
                tasaInputs3[index].readOnly = true;
                porcentajeInputs3[index].value = 15;
                porcentajeInputs3[index].readOnly = true;
                diasGarantiaInputs3[index].value = 1095;
                diasGarantiaInputs3[index].readOnly = true;
                break;
            case 'responsabilidadCivil':
                tasaInputs3[index].value = 0.30;
                tasaInputs3[index].readOnly = true;
                porcentajeInputs3[index].value = 50;
                porcentajeInputs3[index].readOnly = true;
                diasGarantiaInputs3[index].value = 30;
                diasGarantiaInputs3[index].readOnly = true;
                break;
        }
    }

    function deseleccionarGarantia(index) {
        // Limpiar los cálculos relacionados con la garantía deseleccionada
        garantiaInputs3[index].value = '';
        diasGarantiaInputs3[index].value = '';
        fechaFinalGarantiaInputs3[index].value = '';
        porcentajeInputs3[index].value = '';
        valorGarantiaInputs3[index].value = '';
        tasaInputs3[index].value = '';
        primaInputs3[index].value = '';
    
        // Rehabilitar los campos para que se puedan volver a calcular
        tasaInputs3[index].readOnly = false;
        porcentajeInputs3[index].readOnly = false;
        diasGarantiaInputs3[index].readOnly = false;
    
        recalcularPrimaTotal(); // Recalcular la prima total
    }

    function configurarValoresGarantiaOtro(index, input) {
        // Valores fijos para la garantía "Otro"
        tasaInputs3[index].value = 0.20;
        porcentajeInputs3[index].value = 30;

        let selectDias = document.createElement('select');
        selectDias.name = `diasGarantiaOtro${index}`;
        selectDias.className = diasGarantiaInputs3[index].className;

        let opcionesDias = [30, 60, 90, 120, 180];
        opcionesDias.forEach(dias => {
            let option = document.createElement('option');
            option.value = dias;
            option.text = `${dias}`;
            selectDias.appendChild(option);
        });

        diasGarantiaInputs3[index].replaceWith(selectDias);
        selectDias.addEventListener('change', function() {
            diasGarantiaInputs3[index].value = this.value;
            calcularFechaFinalGarantia(index);
            calcularValorGarantia(index);
            calcularPrima(index);
        });

        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                revertirInputASelect(this, index);
            }
        });
    }

    // Función para validar y limitar el valor del contrato
    function validarValorContrato() {
        let valor = parseFloat(valorContratoInput3.value);
        if (isNaN(valor) || valor > maxValorContrato3) {
            valorContratoInput3.value = maxValorContrato3;
            alert(`El valor del contrato no puede ser mayor a ${maxValorContrato3.toLocaleString()}`);
        }
    }

    function calcularFechaFinal() {
        const fechaInicial = new Date(fechaInicialInput3.value);
        const dias = parseInt(diasInput3.value);
        if (!isNaN(fechaInicial) && !isNaN(dias)) {
            const fechaFinal = new Date(fechaInicial);
            fechaFinal.setDate(fechaFinal.getDate() + dias);
            fechaFinalInput3.value = fechaFinal.toISOString().split('T')[0];
            actualizarFechasFinalGarantia();
        }
    }

    function calcularDias() {
        const fechaInicial = new Date(fechaInicialInput3.value);
        const fechaFinal = new Date(fechaFinalInput3.value);
        if (!isNaN(fechaInicial) && !isNaN(fechaFinal)) {
            const diferenciaTiempo = fechaFinal - fechaInicial;
            const dias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
            diasInput3.value = dias;
        }
    }

    function calcularDiasEntreFechas(fechaInicial, fechaFinal) {
        const diferenciaTiempo = fechaFinal - fechaInicial;
        return Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
    }

    function calcularFechaFinalGarantia(index) {
        const fechaFinalContrato = new Date(fechaFinalInput3.value);
        const diasGarantia = parseInt(diasGarantiaInputs3[index].value);
        if (!isNaN(fechaFinalContrato) && !isNaN(diasGarantia)) {
            const fechaFinalGarantia = new Date(fechaFinalContrato);
            fechaFinalGarantia.setDate(fechaFinalGarantia.getDate() + diasGarantia);
            fechaFinalGarantiaInputs3[index].value = fechaFinalGarantia.toISOString().split('T')[0];
        }
    }

    function actualizarFechasFinalGarantia() {
        fechaFinalGarantiaInputs3.forEach((input, index) => {
            calcularFechaFinalGarantia(index);
        });
    }

    // Calcular el valor de la garantía
    function calcularValorGarantia(index) {
        const valorContrato = parseFloat(valorContratoInput3.value) || 0;
        const porcentaje = parseFloat(porcentajeInputs3[index].value) || 0;

        // Calcular el valor de la garantía basado en el porcentaje
        let valorGarantia = Math.round((valorContrato * porcentaje) / 100);

        // Excepción para responsabilidadCivil
        if (garantiaSelects3[index].value === "responsabilidadCivil") {
            valorGarantia = Math.max(valorGarantia, MIN_VALOR_RESPONSABILIDAD);
        }

        valorGarantiaInputs3[index].value = valorGarantia;
        calcularPrima(index);
    }

    function calcularPrima(index) {
        const valorGarantia = parseFloat(valorGarantiaInputs3[index].value) || 0;
        const tasa = parseFloat(tasaInputs3[index].value) || 0;
    
        // Obtener las fechas correctas de la garantía seleccionada
        const fechaInicialGarantia = new Date(fechaInicialInput3.value);
        const fechaFinalGarantia = new Date(fechaFinalGarantiaInputs3[index].value);
    
        if (!isNaN(fechaInicialGarantia) && !isNaN(fechaFinalGarantia) && valorGarantia > 0 && tasa > 0) {
            const dias = calcularDiasEntreFechas(fechaInicialGarantia, fechaFinalGarantia);
    
            // Calcular la prima ajustada por el número de días en el año
            const prima = Math.round((valorGarantia * (tasa / 100)) * (dias / 365));
            primaInputs3[index].value = prima;
        }
    }

    function calcularSumaCum() {
        let sumaCum = 0;
        let algunaGarantiaSeleccionada = false;
    
        garantiaSelects3.forEach((select, index) => {
            if (select.value !== 'responsabilidadCivil') {
                const prima = parseFloat(primaInputs3[index].value) || 0;
                
                // Si la garantía es "Otro", sigue adelante con el cálculo sin modificar
                if (select.value === 'otro') {
                    // No modificamos el cálculo de prima para "Otro", simplemente lo incluimos en la suma
                }
    
                // Verifica si la garantía tiene prima mayor a 0
                if (prima > 0) {
                    algunaGarantiaSeleccionada = true; 
                }
                sumaCum += prima;
            }
        });
    
        // Solo aplicar la prima mínima si hay alguna garantía seleccionada
        if (algunaGarantiaSeleccionada && sumaCum < 80000) {
            sumaCum = 80000;
        }
    
        document.getElementById('sumaCum3').value = sumaCum;
    
        const ivaCum = Math.round(sumaCum * 0.19);
        document.getElementById('ivaCum3').value = ivaCum;
    
        const gastosExpedicion = parseFloat(document.getElementById('gastosExpedicion3').value) || 0;
        const totalCum = sumaCum + gastosExpedicion + ivaCum;
        document.getElementById('totalCum3').value = totalCum;
    }
    
    function calcularSumaRce() {
        let sumaRce = 0;
        let responsabilidadCivilSeleccionada = false;
    
        garantiaSelects3.forEach((select, index) => {
            if (select.value === 'responsabilidadCivil') {
                const prima = parseFloat(primaInputs3[index].value) || 0;
                if (prima > 0) {
                    responsabilidadCivilSeleccionada = true; // Verifica si responsabilidad civil está seleccionada con prima mayor a 0
                }
                sumaRce += prima;
            }
        });
    
        // Solo aplicar la prima mínima si 'Responsabilidad Civil' está seleccionada
        if (responsabilidadCivilSeleccionada && sumaRce < 80000) {
            sumaRce = 80000;
        }
    
        document.getElementById('sumaRCE3').value = sumaRce;
    
        const ivaRce = Math.round(sumaRce * 0.19);
        document.getElementById('ivaRCE3').value = ivaRce;
    
        let gastosExpedicionRce = 0;

        // Solo agregar los 10,000 de gastos de expedición si 'Responsabilidad Civil' está seleccionada
        if (responsabilidadCivilSeleccionada) {
            gastosExpedicionRce = 10000; // Valor fijo de 10,000
        }
    
        const totalRce = sumaRce + gastosExpedicionRce + ivaRce;
        document.getElementById('totalRCE3').value = totalRce;
    }
    
    
    function calcularTotalPrimas() {
        const sumaCum = parseFloat(document.getElementById('totalCum3').value) || 0;
        const sumaRce = parseFloat(document.getElementById('totalRCE3').value) || 0;
    
        const totalPrimas = sumaCum + sumaRce;
    
        document.getElementById('total3').value = totalPrimas;
    }
    
    function recalcularTotales() {
        calcularSumaCum();
        calcularSumaRce();
        calcularTotalPrimas(); // Sumar los totales de CUM y RCE
    }
    
    garantiaSelects3.forEach((select, index) => {
        select.addEventListener('change', function() {
            recalcularTotales();
        });
    });
    
    document.addEventListener('DOMContentLoaded', recalcularTotales);

/*
    function actualizarTotalPrima() {
        let totalPrima = 0;
        primaInputs3.forEach(input => {
            totalPrima += parseFloat(input.value) || 0;
        });
    
        // Ajuste si el total prima es menor que 80,000
        if (totalPrima < 75000) {
            totalPrima = 80000;
        }
    
        totalPrimaInput3.value = totalPrima;
        calcularIVA(); // Recalcular IVA cuando cambia el total de la prima
    }
    
    function recalcularPrimaTotal() {
        // Recalcular la prima total después de deseleccionar una garantía
        let totalPrima = 0;
        primaInputs3.forEach(input => {
            totalPrima += parseFloat(input.value) || 0;
        });

        // Ajuste si el total prima es menor que 80,000
        if (totalPrima < 75000) {
            totalPrima = 80000;
        }
    
        totalPrimaInput3.value = totalPrima;
        calcularIVA();
    }

    function calcularIVA() {
        const totalPrima = parseFloat(totalPrimaInput3.value) || 0;
        const gastosExpedicion = parseFloat(gastosExpedicionInput3.value) || 0;
        const iva = Math.round((totalPrima + gastosExpedicion) * 0.19);
        ivaInput3.value = iva;
        calcularTotalConIva();
    }

    function calcularTotalConIva() {
        const totalPrima = parseFloat(totalPrimaInput3.value) || 0;
        const gastosExpedicion = parseFloat(gastosExpedicionInput3.value) || 0;
        const iva = parseFloat(ivaInput3.value) || 0;
        const total = totalPrima + gastosExpedicion + iva;
        totalConIvaInput3.value = total;
    }*/

    // Eventos con debounce
    valorContratoInput3.addEventListener('input', validarValorContrato);

    fechaInicialInput3.addEventListener('input', function() {
        garantiaInputs3.forEach(input => input.value = this.value);
        calcularFechaFinal();
    });

    diasInput3.addEventListener('input', calcularFechaFinal);
    fechaFinalInput3.addEventListener('input', function() {
        calcularDias();
        actualizarFechasFinalGarantia();
    });

    valorContratoInput3.addEventListener('input', function() {
        garantiaSelects3.forEach((_, index) => calcularValorGarantia(index));
    });

});
