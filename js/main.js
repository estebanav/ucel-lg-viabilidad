$(document).ready(function(){

// Carga todos los listboxes para los valores
	$('td.valor').each(function( i ){
		var tipo = $(this).attr('data-tipo');
		$(this).html( $('script#' + tipo).html() );
		$(this).find('select option[value="'+tablaEj[i]+'"]').attr('selected',true);
	});

	calculoViabilidad();

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

	var resultadoFinal = vectorDivEscalar( 2 , terminoAMasB );	

	$('var#vcp').val(resultadoFinal).html(vectorAHTML(resultadoFinal));

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

	var resultadoFinal = vectorDivEscalar( 2 , terminoAMasB );	

	$('var#vca').val(resultadoFinal).html(vectorAHTML(resultadoFinal));

// Dimensión Éxito

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

	var resultadoFinal = vectorDivEscalar( 2 , terminoAMasB );	

	$('var#vce').val(resultadoFinal).html(vectorAHTML(resultadoFinal));	
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

// Devuelve un vector como un String
function vectorAHTML( vector ){	
	for (var i = 0; i < vector.length; i++) {
		vector[i] = vector[i].toFixed(2);;
	};
	return "[" + vector.join(' , ') + "]";
}

// Devuelve el vector de valores para la dimensión a calcular
function crearVectorValores( vector , valores ){
	var vectorValores = [];
	for (var i = 0 ; i < vector.length; i++) {
		vectorValores[i] = obtenerValor( vector[i] , valores );
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