$(document).ready(function(){

	$('td.valor').each(function(){
		var tipo = $(this).attr('data-tipo');
		$(this).html( $('script#' + tipo).html() );
	});

// Dimensión Plausibilidad [0]

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

});

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

// Devuelve el vector de valores para la dimensión a calcular
function crearVectorValores( vector , valores ){
	var vectorValores = [];
	for (var i = 0 ; i < vector.length; i++) {
		vectorValores[i] = obtenerValor( vector[i] , valores );
	};		
	return vectorValores;
}

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