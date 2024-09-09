document.addEventListener('DOMContentLoaded', function() {
   
    const claveInput = document.getElementById('claveInput');
    const toggleClave = document.getElementById('toggleClave');
    const eyeIcon = document.getElementById('eyeIcon');

    toggleClave.addEventListener('click', function() {
        if (claveInput.type === 'password') {
            claveInput.type = 'text';
            eyeIcon.textContent = '🙈'; // Cambia el ícono cuando la clave es visible
        } else {
            claveInput.type = 'password';
            eyeIcon.textContent = '👁️'; // Cambia el ícono cuando la clave está oculta
        }
    });

    // Define la clave para desactivar el límite
    const CLAVE_CORRECTA = '260165'; // Cambia esto a tu clave deseada
    let bloqueoDesactivado = false;
    
    const cotizadorPrincipal = document.getElementById('cotizadorPrincipal');
    const cotizadorDos = document.getElementById('cotizadorDos');
    const cotizadorTres = document.getElementById('cotizadorTres');

    // Evento para abrir el segundo cotizador
    document.getElementById('openCotizador2').addEventListener('click', function() {
        cotizadorPrincipal.style.display = 'none'; // Ocultar el cotizador principal
        cotizadorDos.style.display = 'block'; // Mostrar el cotizador duplicado
        cotizadorTres.style.display = 'none'; // Asegúrate de ocultar el cotizador 3
    });

    // Evento para abrir el tercer cotizador
    document.getElementById('openCotizador3').addEventListener('click', function() {
        cotizadorPrincipal.style.display = 'none';
        cotizadorDos.style.display = 'none';
        cotizadorTres.style.display = 'block';
    });   
    
    // Evento para volver al cotizador principal desde el segundo cotizador
    document.getElementById('volverPrincipal').addEventListener('click', function() {
        cotizadorDos.style.display = 'none'; // Ocultar el cotizador duplicado
        cotizadorPrincipal.style.display = 'block'; // Mostrar el cotizador principal
        cotizadorTres.style.display = 'none'; // Asegúrate de ocultar el cotizador 3
    });

    // Evento para volver al cotizador principal desde el tercer cotizador
    document.getElementById('volverPrincipal3').addEventListener('click', function() {
        cotizadorDos.style.display = 'none'; // Ocultar el cotizador duplicado
        cotizadorPrincipal.style.display = 'block'; // Mostrar el cotizador principal
        cotizadorTres.style.display = 'none'; // Asegúrate de ocultar el cotizador 3
    });
    
    const maxFilas = 8;
    const addRowButton = document.getElementById('addRow');
    let currentRowCount = 1;

    // Inicializa la primera fila visible y oculta las demás
    updateRowVisibility();

    addRowButton.addEventListener('click', function() {
        const filasVisibles = document.querySelectorAll('.garantia-row:not([style*="display: none"])').length;

        if (filasVisibles < maxFilas) {
            // Encuentra la primera fila oculta y la muestra
            const nextRow = Array.from(document.querySelectorAll('.garantia-row')).find(row => row.style.display === 'none');
            if (nextRow) {
                nextRow.style.display = '';
                currentRowCount++;
                reasignarEventos();
            }
        } else {
            alert('No se pueden añadir más de 8 filas.');
        }
    });

    function updateRowVisibility() {
        const rows = document.querySelectorAll('.garantia-row');
        rows.forEach((row, index) => {
            row.style.display = index === 0 ? '' : 'none';
        });
    }

    function reasignarEventos() {
        const removeButtons = document.querySelectorAll('.remove-row');

        removeButtons.forEach(button => {
            button.removeEventListener('click', handleRemoveRow); // Evita duplicar eventos
            button.addEventListener('click', handleRemoveRow);
        });
    }

    function handleRemoveRow(event) {
        const row = event.target.closest('.garantia-row');
        row.style.display = 'none'; // Oculta la fila
        row.querySelectorAll('input, select').forEach(input => input.value = ''); // Resetea los valores de los campos
        currentRowCount--;
        calcularPrima(); // Recalcula la prima después de eliminar la fila
        actualizarTotalPrima();
    }

    const fechaInicialInput = document.getElementById('desde');
    const diasInput = document.getElementById('dias');
    const fechaFinalInput = document.getElementById('hasta');

    const valorContratoInput = document.getElementById('valorContrato');

    const garantiaSelects = document.querySelectorAll('select[name="garantia"]');

    const garantiaInputs = document.querySelectorAll('input[name^="fechaInicialGarantia"]');
    const diasGarantiaInputs = document.querySelectorAll('input[name^="diasGarantia"]');
    const fechaFinalGarantiaInputs = document.querySelectorAll('input[name^="fechaFinalGarantia"]');
    const porcentajeInputs = document.querySelectorAll('input[name^="porcentaje"]');
    const valorGarantiaInputs = document.querySelectorAll('input[name^="valorGarantia"]');
    const tasaInputs = document.querySelectorAll('input[name^="tasa"]');
    const primaInputs = document.querySelectorAll('input[name^="prima"]');

    const totalPrimaInput = document.getElementById('totalPrima');
    const gastosExpedicionInput = document.getElementById('gastosExpedicion');
    const ivaInput = document.getElementById('iva');
    const totalConIvaInput = document.getElementById('total');

    const maxValorContrato = 300000000;

    /*// Manejo de tasas fijas según la garantía seleccionada
    garantiaSelects.forEach((select, index) => {
        select.addEventListener('change', function() {
            const tasaInput = tasaInputs[index];
            switch (this.value) {
                case 'seriedad':
                    tasaInput.value = 0.12;
                    tasaInput.readOnly = true;
                    break;
                case 'responsabilidadCivil':
                    tasaInput.value = 0.30;
                    tasaInput.readOnly = true;
                    break;
                case 'anticipo':
                case 'pagoanticipado':
                case 'cumplimiento':
                case 'calidadServicio':
                case 'calidaddelosbienes':
                case 'salarios':
                    tasaInput.value = 0.22;  // Ajusta este valor según lo necesites
                    tasaInput.readOnly = true;
                    break;
                default:
                    tasaInput.value = '';
                    tasaInput.readOnly = false;
                    break;
            }
            calcularPrima(); // Recalcula la prima al cambiar la tasa
        });
    });*/

    garantiaSelects.forEach((select, index) => {
        select.addEventListener('change', function() {
            if (this.value === 'otro') {
                // Convertir el campo select en un campo de texto
                let input = document.createElement('input');
                input.type = 'text';
                input.name = select.name; // Mantener el mismo nombre para el input
                input.className = select.className; // Mantener la misma clase
                input.placeholder = 'Ingrese el nombre de la garantía';
                select.replaceWith(input); // Reemplazar el select por el input
        
                // Borrar la tasa y hacer el campo editable
                tasaInputs[index].value = '';
                tasaInputs[index].readOnly = !bloqueoDesactivado;

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
                calcularPrima(); // Recalcula la prima al cambiar la tasa
            } else {
                // Opcional: manejar el caso en que no se seleccione ninguna garantía
                tasaInputs[index].value = '';
                tasaInputs[index].readOnly = false;
            }
        });
    });
    
    function revertirInputASelect(input, index) {
        let newSelect = document.createElement('select');
        newSelect.name = input.name;
        newSelect.className = input.className;
        newSelect.innerHTML = `
            <option value="">Seleccione una garantía</option>
            <option value="seriedad">Seriedad</option>
            <option value="responsabilidadCivil">Responsabilidad Civil</option>
            <option value="anticipo">Anticipo</option>
            <option value="pagoanticipado">Pago Anticipado</option>
            <option value="cumplimiento">Cumplimiento</option>
            <option value="calidadServicio">Calidad del Servicio</option>
            <option value="calidaddelosbienes">Calidad de los Bienes</option>
            <option value="salarios">Salarios</option>
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
            } else if (this.value !== '') {
                configurarValoresGarantia(this.value, index);
                calcularPrima(); // Recalcula la prima al cambiar la tasa
            } else {
                // Opcional: manejar el caso en que no se seleccione ninguna garantía
                tasaInputs[index].value = '';
                tasaInputs[index].readOnly = false;
            }
        });
    }
    
    function configurarValoresGarantia(garantia, index) {
        switch (garantia) {
            case 'seriedad':
                tasaInputs[index].value = 0.12;
                tasaInputs[index].readOnly = true;
                break;
            case 'responsabilidadCivil':
                tasaInputs[index].value = 0.30;
                tasaInputs[index].readOnly = true;
                break;
            case 'anticipo':
            case 'pagoanticipado':
            case 'cumplimiento':
            case 'calidadServicio':
            case 'calidaddelosbienes':
            case 'salarios':
                tasaInputs[index].value = 0.22;
                tasaInputs[index].readOnly = true;
                break;
            default:
                tasaInputs[index].value = '';
                tasaInputs[index].readOnly = false;
                break;
        }
    }

    function calcularFechaFinal(fechaInicial, dias) {
        if (!fechaInicial || isNaN(dias) || dias <= 0) {
            return '';
        }
        const fecha = new Date(fechaInicial);
        fecha.setDate(fecha.getDate() + parseInt(dias));
        return fecha.toISOString().split('T')[0];
    }

    function actualizarFechaFinal() {
        const fechaInicial = fechaInicialInput.value;
        const dias = diasInput.value;
        fechaFinalInput.value = calcularFechaFinal(fechaInicial, dias);
        actualizarFechaFinalGarantia();
    }

    // Calcula los días cuando se ingresa manualmente la fecha final
    function actualizarDiasDesdeFechaFinal() {
        const fechaInicial = fechaInicialInput.value;
        const fechaFinal = fechaFinalInput.value;
        if (fechaInicial && fechaFinal) {
            const dias = calcularDias(fechaInicial, fechaFinal);
            diasInput.value = dias;
        }
    }
    
    function validarValorContrato() {
        let valor = parseFloat(valorContratoInput.value);
        if (isNaN(valor) || (!bloqueoDesactivado && valor > maxValorContrato)) {
            valorContratoInput.value = maxValorContrato;
            alert(`El valor del contrato no puede ser mayor a ${maxValorContrato.toLocaleString()}`);
        }
    }

    // Maneja la clave para desactivar el límite
    claveInput.addEventListener('input', function() {
        if (claveInput.value === CLAVE_CORRECTA) {
            bloqueoDesactivado = true;
            claveInput.value = ''; // Limpia el campo de clave
            alert('Controles técnicos desactivados.');
            // Habilitar todos los campos "Otro" que están deshabilitados
            let otroInputs = document.querySelectorAll('input[name="otro"]');
            otroInputs.forEach(input => input.disabled = false);
            let tasaInputs = document.querySelectorAll('input.tasa'); // Asegúrate de tener una clase para tasas
            tasaInputs.forEach(input => input.readOnly = false);
        }
    });

    function actualizarFechasGarantia() {
        const fechaInicial = fechaInicialInput.value;
        garantiaInputs.forEach(input => input.value = fechaInicial);
    }

    function calcularValorGarantia(porcentaje, valorContrato) {
        if (isNaN(porcentaje) || isNaN(valorContrato)) {
            return 0;
        }
        return Math.round(valorContrato * (porcentaje / 100));
    }

    function calcularPorcentaje(valorGarantia, valorContrato) {
        if (isNaN(valorGarantia) || isNaN(valorContrato) || valorContrato <= 0) {
            return 0;
        }
        return Math.round((valorGarantia / valorContrato) * 100);
    }

    function actualizarValorGarantia() {
        porcentajeInputs.forEach((input, index) => {
            const porcentaje = input.value;
            const valorContrato = valorContratoInput.value;
            valorGarantiaInputs[index].value = calcularValorGarantia(porcentaje, valorContrato);
        });
    }

    function actualizarPorcentajeGarantia() {
        valorGarantiaInputs.forEach((input, index) => {
            const valorGarantia = input.value;
            const valorContrato = valorContratoInput.value;
            porcentajeInputs[index].value = calcularPorcentaje(valorGarantia, valorContrato);
        });
    }

    function actualizarFechaFinalGarantia() {
        const fechaFinal = fechaFinalInput.value;
        const diasGarantiaInputs = document.querySelectorAll('input[name^="diasGarantia"]');
        const fechaFinalGarantiaInputs = document.querySelectorAll('input[name^="fechaFinalGarantia"]');
        diasGarantiaInputs.forEach((input, index) => {
            const dias = input.value;
            fechaFinalGarantiaInputs[index].value = calcularFechaFinal(fechaFinal, dias);
        });
    }

    function calcularDiasGarantiaDesdeFechaFinal() {
        const fechaFinalContrato = fechaFinalInput.value;
        const fechaFinalGarantiaInputs = document.querySelectorAll('input[name^="fechaFinalGarantia"]');
        const diasGarantiaInputs = document.querySelectorAll('input[name^="diasGarantia"]');
        fechaFinalGarantiaInputs.forEach((input, index) => {
            const fechaFinalGarantia = input.value;
            if (fechaFinalGarantia) {
                const dias = calcularDias(fechaFinalContrato, fechaFinalGarantia);
                diasGarantiaInputs[index].value = dias;
            }
        });
    }

    fechaFinalGarantiaInputs.forEach((input) => {
        input.addEventListener('input', () => {
            calcularDiasGarantiaDesdeFechaFinal();
            calcularPrima();  // Si es necesario recalcular la prima también
    });
    });

    function calcularDias(fechaInicial, fechaFinal) {
        const fechaInicio = new Date(fechaInicial);
        const fechaFin = new Date(fechaFinal);
        const diferenciaEnTiempo = fechaFin.getTime() - fechaInicio.getTime();
        return Math.round(diferenciaEnTiempo / (1000 * 3600 * 24));
    }

    function calcularPrima() {
        // Obtener todos los inputs relevantes
        const valorGarantiaInputs = document.querySelectorAll('input[name^="valorGarantia"]:not([style*="display: none"])');
        const tasaInputs = document.querySelectorAll('input[name^="tasa"]:not([style*="display: none"])');
        const diasGarantiaInputs = document.querySelectorAll('input[name^="diasGarantia"]:not([style*="display: none"])');
        const primaInputs = document.querySelectorAll('input[name^="prima"]:not([style*="display: none"])');
        const garantiaSelects = document.querySelectorAll('select[name="garantia"]');
        const fechaInicialGarantiaInputs = document.querySelectorAll('input[name^="fechaInicialGarantia"]');
        const fechaFinalGarantiaInputs = document.querySelectorAll('input[name^="fechaFinalGarantia"]');
        
        valorGarantiaInputs.forEach((input, index) => {
            const valorGarantia = parseFloat(input.value) || 0;
            const fechaInicialGarantia = fechaInicialGarantiaInputs[index]?.value || '';
            const fechaFinalGarantia = fechaFinalGarantiaInputs[index]?.value || '';
            const tasa = parseFloat(tasaInputs[index].value) || 0;
            const diasGarantia = parseInt(diasGarantiaInputs[index].value) || 0;
            const garantia = garantiaSelects[index]?.value.toLowerCase() || '';

            let prima = 0;

            if (valorGarantia > 0 && tasa > 0 && fechaInicialGarantia && fechaFinalGarantia) {
                if (garantia.includes("seriedad")) {
                    // Exclusivamente para "Seriedad": calcular prima solo con valorGarantia y tasa
                    prima = valorGarantia * (tasa / 100);
                } else {
                    // Calcular con los días de garantía si están presentes
                    const dias = calcularDias(fechaInicialGarantia, fechaFinalGarantia);
                    if (diasGarantia > 0) {
                        prima = Math.round((valorGarantia * (tasa / 100)) * (dias / 365));
                    } else {
                        // Si no se ingresan días, usar los días del contrato
                        prima = Math.round((valorGarantia * (tasa / 100)) * (dias / 365));
                    }
                }
                primaInputs[index].value = prima.toFixed();
            } else {
                primaInputs[index].value = ''; // Resetea el valor de la prima si no se cumplen las condiciones
            }
        });

        calcularSumaCum();
        calcularSumaRCE();
        actualizarTotalPrima();
    }

    function calcularSumaCum() {
        const valorGarantiaInputs = document.querySelectorAll('input[name^="valorGarantia"]:not([style*="display: none"])');
        const tasaInputs = document.querySelectorAll('input[name^="tasa"]:not([style*="display: none"])');
        const garantiaSelects = document.querySelectorAll('select[name="garantia"]');

        let sumaCum = 0;

        valorGarantiaInputs.forEach((input, index) => {
            const valorGarantia = parseFloat(input.value) || 0;
            const tasa = parseFloat(tasaInputs[index].value) || 0;
            const garantia = garantiaSelects[index]?.value.toLowerCase() || '';

            let prima = 0;

            if (valorGarantia > 0 && tasa > 0) {
                if (garantia.includes("seriedad")) {
                    // Exclusivamente para "Seriedad": calcular prima solo con valorGarantia y tasa
                    prima = valorGarantia * (tasa / 100);
                } else {
                    // Calcular con los días de garantía si están presentes
                    prima = parseFloat(primaInputs[index].value) || 0;
                }

                if (!garantia.includes("responsabilidadcivil")) {
                    sumaCum += prima; // Suma de otras garantías
                }
            }
        });

        // Ajuste: Si la sumaCum es menor o igual a 75,000, ajusta a 80,000
        if (sumaCum <= 75000) {
            sumaCum = 80000;
        }

        document.getElementById('sumaCum').value = sumaCum.toFixed();
        actualizarIVA('cum');
    }

    function calcularSumaRCE() {
        const valorGarantiaInputs = document.querySelectorAll('input[name^="valorGarantia"]:not([style*="display: none"])');
        const tasaInputs = document.querySelectorAll('input[name^="tasa"]:not([style*="display: none"])');
        const garantiaSelects = document.querySelectorAll('select[name="garantia"]');
    
        let sumaRCE = 0;
        let hasSelectedResponsabilidadCivil = false;  // Verificar si se seleccionó 'Responsabilidad Civil'
    
        valorGarantiaInputs.forEach((input, index) => {
            const valorGarantia = parseFloat(input.value) || 0;
            const tasa = parseFloat(tasaInputs[index].value) || 0;
            const garantia = garantiaSelects[index]?.value.toLowerCase() || '';
    
            let prima = 0;
    
            // Si se selecciona la garantía de Responsabilidad Civil
            if (valorGarantia > 0 && tasa > 0 && garantia.includes("responsabilidadcivil")) {
                hasSelectedResponsabilidadCivil = true;  // Se seleccionó Responsabilidad Civil
                prima = parseFloat(primaInputs[index].value) || 0;
                sumaRCE = prima;
            }
        });
    
        // Solo calcular IVA y actualizar sumaRCE si se seleccionó 'Responsabilidad Civil'
        if (hasSelectedResponsabilidadCivil) {
            if (sumaRCE > 0 && sumaRCE < 90000) {
                sumaRCE = 90000;  // Ajustar el mínimo de sumaRCE
            }
            document.getElementById('sumaRCE').value = sumaRCE.toFixed();
            actualizarIVA('rce');  // Solo calcular el IVA si hay Responsabilidad Civil seleccionada
        } else {
            // Si no se seleccionó Responsabilidad Civil, limpiar los campos relacionados
            document.getElementById('sumaRCE').value = '';  // No se muestra la suma
            document.getElementById('ivaRCE').value = '';   // No se muestra el IVA
            document.getElementById('totalRCE').value = ''; // No se muestra el total prima
        }
    }

    function actualizarIVA(tipo) {
        let suma;
        let ivaId;
        let totalId;
    
        if (tipo === 'cum') {
            suma = parseFloat(document.getElementById('sumaCum').value) || 0;
            ivaId = 'ivaCum';
            totalId = 'totalCum';
        } else if (tipo === 'rce') {
            suma = parseFloat(document.getElementById('sumaRCE').value) || 0;
            ivaId = 'ivaRCE';
            totalId = 'totalRCE';
        }
    
        const gastosExpedicion = parseFloat(document.getElementById('gastosExpedicion').value) || 0;
        const baseImponible = suma + gastosExpedicion;
        const iva = Math.round(baseImponible * 0.19);
    
        document.getElementById(ivaId).value = iva.toFixed(0);
        document.getElementById(totalId).value = (suma + gastosExpedicion + iva).toFixed(0);
        
        // Actualizar el total de la prima con IVA
        actualizarTotalPrima();
    }
    
    function actualizarTotalPrima() {
        const sumaCum = parseFloat(document.getElementById('totalCum').value) || 0;
        const sumaRCE = parseFloat(document.getElementById('totalRCE').value) || 0;
        
        const totalPrima = sumaCum + sumaRCE;
        
        // Actualizar el campo de Total Prima con el valor redondeado
        document.getElementById('total').value = Math.round(totalPrima);
    }

    // Inicializa los gastos de expedición con el valor predeterminado
    gastosExpedicionInput.value = 10000;

    // Función debounce para optimizar el rendimiento
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Eventos con debounce
    valorContratoInput.addEventListener('input', debounce(() => {
        validarValorContrato();
        actualizarValorGarantia();
        calcularPrima();
    }, 300));

    porcentajeInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            actualizarValorGarantia();
            calcularPrima();
        }, 300));
    });

    valorGarantiaInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            actualizarPorcentajeGarantia();
            calcularPrima();
        }, 300));
    });

    tasaInputs.forEach(input => {
        input.addEventListener('input', debounce(calcularPrima, 300));
    });

    gastosExpedicionInput.addEventListener('input', debounce(actualizarIVA, 300));

    // Crea una versión debounced de calcularPrima
    const calcularPrimaDebounced = debounce(calcularPrima, 300);
    
    fechaInicialInput.addEventListener('change', () => {
        actualizarFechasGarantia();
        actualizarFechaFinal();
    });

    diasInput.addEventListener('input', debounce(() => {
        actualizarFechaFinal();
        calcularPrimaDebounced(); // Usa la versión debounced
    }, 300));

    fechaFinalInput.addEventListener('input', debounce(() => {
        actualizarFechaFinalGarantia();
        actualizarDiasDesdeFechaFinal();
        calcularPrimaDebounced();
    }, 300));

    diasGarantiaInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            actualizarFechaFinalGarantia();
            calcularPrima();
        }, 300));
    });

    // Inicializa la primera fila y reasigna eventos
    reasignarEventos();

    //Actualiza las fechas de las garantías al cargar la página
    actualizarFechasGarantia();
});