$(document).ready(function(){

// Carga todos los listboxes para los valores
	$('td.valor').each(function( i ){
		var tipo = $(this).attr('data-tipo');
		$(this).html( $('script#' + tipo).html() );
		$(this).find('select option[value="'+tablaEj[i]+'"]').attr('selected',true);
	});

	calculoViabilidad();

	$('input#actualizar').on('click',function(e){
		e.preventDefault();
		var $valores = [];
		$('table.viabilidad td.valor').each(function(ind){
			var $select = $(this).find('select.valor-atributo');
			var valor = $select.val();
			if( $(this).attr('data-tipo') == 'numerica' ){
				valor = parseInt( valor );
			}
			$valores[ind] = valor;
		});
		tablaEj = $valores;
		calculoViabilidad();		
	});

});

function calculoViabilidad(){

// Dimensión Plausibilidad

	var vectorPPlausibilidad = P.slice( dimensiones.plausibilidad[0] , dimensiones.plausibilidad[1] + 1 );
	
	var vectorValoresPlausibilidad = tablaEj.slice( dimensiones.plausibilidad[0] , dimensiones.plausibilidad[1] + 1 );
	vectorValoresPlausibilidad = crearVectorValores( vectorValoresPlausibilidad , valores );

	var sumatoriaP = sumariatoriaVector( vectorPPlausibilidad );

	var sumatoriaPDivValores = sumatoriaPDivV( vectorPPlausibilidad , vectorValoresPlausibilidad );
	var sumatoriaPPorValores = sumatoriaPPorV( vectorPPlausibilidad , vectorValoresPlausibilidad );

	var terminoA = escalarDivVectorMulti( sumatoriaP , sumatoriaPDivValores );
	var terminoB = vectorDivEscalar( sumatoriaP , sumatoriaPPorValores );
	
	var terminoAMasB = sumatoriaVectores( terminoA , terminoB );

	var resultadoFinalPlausibilidad = vectorDivEscalar( 2 , terminoAMasB );	

	$('var#vcp').val(resultadoFinalPlausibilidad).html(vectorAHTML(resultadoFinalPlausibilidad));

// Dimensión Adecuacion

	var vectorPAdecuacion = P.slice( dimensiones.adecuacion[0] , dimensiones.adecuacion[1] + 1 );
	console.debug( 'vectorPAdecuacion', vectorPAdecuacion);
	var vectorValoresAdecuacion = tablaEj.slice( dimensiones.adecuacion[0] , dimensiones.adecuacion[1] + 1 );
	console.debug( 'vectorValoresAdecuacion 1', vectorValoresAdecuacion);
	vectorValoresAdecuacion = crearVectorValores( vectorValoresAdecuacion , valores );
	console.debug( 'vectorValoresAdecuacion 2', vectorValoresAdecuacion);

	var sumatoriaP = sumariatoriaVector( vectorPAdecuacion );

	var sumatoriaPDivValores = sumatoriaPDivV( vectorPAdecuacion , vectorValoresAdecuacion );
	var sumatoriaPPorValores = sumatoriaPPorV( vectorPAdecuacion , vectorValoresAdecuacion );

	var terminoA = escalarDivVectorMulti( sumatoriaP , sumatoriaPDivValores );
	var terminoB = vectorDivEscalar( sumatoriaP , sumatoriaPPorValores );
	
	var terminoAMasB = sumatoriaVectores( terminoA , terminoB );

	var resultadoFinalAdecuacion = vectorDivEscalar( 2 , terminoAMasB );	

	$('var#vca').val( resultadoFinalAdecuacion ).html(vectorAHTML( resultadoFinalAdecuacion ));

// Dimensión Éxito
	console.log('Calcular Exito');
	var vectorPExito = P.slice( dimensiones.exito[0] , dimensiones.exito[1] + 1 );
	console.debug( 'vectorPExito', vectorPExito);
	var vectorValoresExito = tablaEj.slice( dimensiones.exito[0] , dimensiones.exito[1] + 1 );
	console.debug( 'vectorValoresExito 1', vectorValoresExito);
	vectorValoresExito = crearVectorValores( vectorValoresExito , valores );
	console.debug( 'vectorValoresExito 2', vectorValoresExito);

	var sumatoriaP = sumariatoriaVector( vectorPExito );

	var sumatoriaPDivValores = sumatoriaPDivV( vectorPExito , vectorValoresExito );
	var sumatoriaPPorValores = sumatoriaPPorV( vectorPExito , vectorValoresExito );

	var terminoA = escalarDivVectorMulti( sumatoriaP , sumatoriaPDivValores );
	var terminoB = vectorDivEscalar( sumatoriaP , sumatoriaPPorValores );
	
	var terminoAMasB = sumatoriaVectores( terminoA , terminoB );

	var resultadoFinalExito = vectorDivEscalar( 2 , terminoAMasB );	
console.log('FIN Calcular Exito');
	$('var#vce').val(resultadoFinalExito).html(vectorAHTML(resultadoFinalExito));	

// Dimensión Justificación
	var vectorPJustificacion = P.slice( dimensiones.justificacion[0] , dimensiones.justificacion[1] + 1 );
	console.debug( 'vectorPJustificacion', vectorPJustificacion );
	
	var vectorValoresJustificacion = tablaEj.slice( dimensiones.justificacion[0] , dimensiones.justificacion[1] + 1 );
	console.debug( 'vectorValoresJustificacion 1', vectorValoresJustificacion);
	vectorValoresJustificacion = crearVectorValoresJustificacion( vectorValoresJustificacion , valores );
	console.debug( 'vectorValoresJustificacion 2', vectorValoresJustificacion);

	var $tabla 		= $('table.tabla-justificacion');
	var $peso 		= $tabla.find('td.peso');
	var $valores 	= $tabla.find('td.valor');
	var $pesoValor 	= $tabla.find('td.peso-valor');
	var $aproximacion = $tabla.find('td.aprox-num');
	var aproxNum = [];

	$valores.each(function( ind ){		
		$(this).html( '[ ' + vectorValoresJustificacion[ind].join(' , ') + ' ]' );		
		var peso = parseFloat( $($peso[ind]).html() );
		var pesoXValor = escalarPorVectorMulti( peso , vectorValoresJustificacion[ind] );
		var suma = 0;
		for (var i = 0; i < pesoXValor.length; i++) {
			pesoXValor[i] = pesoXValor[i].toFixed(2);
			suma += parseFloat( pesoXValor[i] );
		};		
		aproxNum[ind] = (suma / pesoXValor.length).toFixed(2);
		$($pesoValor[ind]).html( '[ ' + pesoXValor.join(' , ') + ' ]' );
		$($aproximacion[ind]).html( aproxNum[ind] );
	});

	var max 	= aproxNum[0];
	var maxInd 	= 0;
	for (var i = 0; i < aproxNum.length; i++) {
		if( aproxNum[i] > max ){
			max = aproxNum[i];
			maxInd = i;
		}
	};

	$('var#max').html(maxInd+1);
	var resultadoFinalJustificacion = vectorValoresJustificacion[ maxInd ];
	$('var#vcj').val(vectorValoresJustificacion[ maxInd ]).html(vectorAHTML(vectorValoresJustificacion[ maxInd ]));	

// Viabilidad Final
	
	var sumPFinal = sumariatoriaVector( PFinal );
	var vFinal = [ resultadoFinalPlausibilidad , resultadoFinalJustificacion , resultadoFinalAdecuacion , resultadoFinalExito ];
	var pFPorVF = sumatoriaPPorV( [sumPFinal] , vFinal );
	var resultadoViabilidadFinal = vectorDivEscalar( sumPFinal , pFPorVF );
	$('var#vf').val(resultadoViabilidadFinal).html(vectorAHTML(resultadoViabilidadFinal));	

	var matrizGrafico = new Array(5);
	console.log('plausibilidad',resultadoFinalPlausibilidad);
	matrizGrafico[0] = generaMatriz( resultadoFinalPlausibilidad );
	console.log('adecuacion',resultadoFinalAdecuacion);
	matrizGrafico[1] = generaMatriz( resultadoFinalAdecuacion );
	console.log('exito',resultadoFinalExito);
	matrizGrafico[2]  = generaMatriz( resultadoFinalExito );
	console.log('justificacion',resultadoFinalJustificacion);
	matrizGrafico[3]  = generaMatriz( resultadoFinalJustificacion );
	console.log('final',resultadoViabilidadFinal);
	matrizGrafico[4]  = generaMatriz( resultadoViabilidadFinal );
	console.log(matrizGrafico);
	$.jqplot('chartdiv',  matrizGrafico );
}

// genera la matriz para la gráfica 

function generaMatriz( unVector ){
	var elem = [0,1,1,0];
	var vectorTmp = [];
	for (var i = 0; i < unVector.length; i++) {
		vectorTmp[i] = [parseFloat(unVector[i]),elem[i]]
	};
	return vectorTmp;

}
// Obtiene el valor correspondiente a un atributo
// ej.1 mucho = [5.6,6.6,7.8,8.8]
// ej.2 9 = [9,9,9,9]
// devuelve un vector
function obtenerValor( unValor , valores ){
    if( isNaN( unValor )){
        return valores[unValor];
    }else{
        return [unValor,unValor,unValor,unValor];
    }
}

// Obtiene el valor correspondiente a un atributo para calcular Justificación
// ej.1 mucho = [5.6,6.6,7.8,8.8]
// ej.2 9 = [9]
// devuelve un vector
function obtenerValorJustificacion( unValor , valores ){

    if( isNaN( unValor )){
        
    		console.log(valores[unValor],'unvalor',unValor);
    	
        return valores[unValor];
    }else{
    	
        return [unValor];
    }
}

// Devuelve un vector como un String
function vectorAHTML( vector ){	
	console.log(vector);
	var vectorTmp = [];
	for (var i = 0; i < vector.length; i++) {		
		vectorTmp[i] = vector[i].toFixed(2);
	};
	return "[" + vectorTmp.join(' , ') + "]";
}

// Devuelve el vector de valores para la dimensión a calcular
function crearVectorValores( vector , valores ){
	var vectorValores = [];
	for (var i = 0 ; i < vector.length; i++) {
		vectorValores[i] = obtenerValor( vector[i] , valores );
	};		
	return vectorValores;
}

// Devuelve el vector de valores para la dimensión a calcular
function crearVectorValoresJustificacion( vector , valores ){
	var vectorValores = [];
	for (var i = 0 ; i < vector.length; i++) {
		vectorValores[i] = obtenerValorJustificacion( vector[i] , valores );
	};		
	return vectorValores;
}

//

// Calcula la sumatoria de un vector
function sumariatoriaVector( vector ){
	var sumatoria = 0;
	for( var i = 0 ; i < vector.length ; i++ ){			
		sumatoria += vector[i];
	}
	return sumatoria;
}

// Divide un escalar (a) por un vector del tipo [a,b]
// Retorna un vector del tipo [a,b]
function escalarDivVectorMulti( escalar , vector ){	
	var resultado = [];
	for (var j = 0 ; j < vector.length ; j++) {		
		resultado[j] = escalar / vector[j];	
	};	
	return resultado;
}

// Multiplica un escalar (a) por un vector del tipo [a,b]
// Retorna un vector del tipo [a,b]
function escalarPorVectorMulti( escalar , vector ){	
	var resultado = [];
	for (var j = 0 ; j < vector.length ; j++) {		
		resultado[j] = escalar * vector[j];	
	};	
	return resultado;
}

// Divide un vector del tipo [a,b] por un escalar (a)
// Retorna un vector del tipo [a,b]
function vectorDivEscalar( escalar , vector ){	
	var resultado = [];
	for (var j = 0 ; j < vector.length ; j++) {		
		resultado[j] = vector[j] / escalar;	
	};	
	return resultado;
}

// Calcula la sumatoria de la matriz de valores (P) dividia el vector de dimension (V)
function sumatoriaPDivV( p , v ) {
	var sumatoria = [0,0,0,0];
	for (var i = 0 ; i < p.length ; i++ ) {
		var resultado = escalarDivVectorMulti( p[i] , v[i] );
		console.log(resultado,'resultado');
		for( var j = 0 ; j < resultado.length ; j++ ){
			sumatoria[j] += resultado[j];
		}
	};
	return sumatoria;
}

// Calcula la sumatoria de la matriz de valores P multiplicada por el vector de dimension (V)
function sumatoriaPPorV( p , v ){
	var sumatoria = [0,0,0,0];
	for (var i = 0 ; i < p.length ; i++ ) {
		var resultado = escalarPorVectorMulti( p[i] , v[i] );		
		for( var j = 0 ; j < resultado.length ; j++ ){
			sumatoria[j] += resultado[j];
		}
	};	
	return sumatoria;
}

// Calcula la sumatoria de dos vectores
function sumatoriaVectores( vector1 , vector2 ){
	var sumatoria = [];
	for( var i = 0 ; i < vector1.length ; i++ ){
		sumatoria[i] = vector1[i] + vector2[i];
	}
	return sumatoria;	
}