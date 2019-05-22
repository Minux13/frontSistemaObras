function setTD(el, className) {
    return '<td class="'+ className +'">'+el+'</td>';
}


function setLegendsChart(data){
    
    var widthWindow = jQuery(window).width()

    var legendCh = '<div id="containerLegends">';
    for(var i in data){
        if(data[i].y == 0 || data[i].y == null ){
            ;
        }else{
            console.log(data[i].y);
            var shape = '<svg xmlns="http://www.w3.org/2000/svg"> <circle fill="'+ data[i].color +'" /> </svg>'
            var spanY = '<span>'+ data[i].y +'</span>  '
            var spanName = '<span>'+ data[i].name +'</span>  '
            legendCh += '<p class="legendRebanada"> '+ shape + spanY + spanName +'</p>';
        }
    }
    legendCh += '</div>';

    if(widthWindow < 600){
        var chartDataLabel = false;                
        document.getElementById('genl-legend-pie-chart').innerHTML = legendCh;
    }else{
        var chartDataLabel = true;
        document.getElementById('genl-legend-pie-chart').innerHTML = '';
    }

    return chartDataLabel;
}


function loadDataPieChart(dependency) {
    $.getJSON('./static/mock/plots.json', function(data) {
        //try {
   	        //var data = camposGPie[id-1].plots;
            var plots;
            var strJSon = "[{}]";        
            plots = jsonPath(data, "$.[?(@.id=='"+dependency+"')].plots[*]");
            strJSon = JSON.stringify(plots);
            var data = JSON.parse(strJSon);

            var numTotales = 0; //Sum of all obras for titulo
            for(var dd in data){
                numTotales += parseInt(data[dd].y);
            }
            
            var chartDataLabel = setLegendsChart(data)
            var chartShowInLegend = false;  //Deprecable
                        
            for (var y in data ){
                if(data[y].y == 0){
                    data[y].y = null
                }
            }
   	    	
            var options = {
   	    	    chart: {
   	    		    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    },
                    /*events: {
                        render: function () {
                            var enableDataLabel = setLegendsChart(data);
                            console.log(this);
                            this.series[0].plotOptions.dataLabels.enabled = enableDataLabel
                        }
                    } */   
   	    		},
   	    		title: {
   	    	        text: 'TOTAL DE OBRAS ' + numTotales
   	    		},
   	    		tooltip: {
   	    	        pointFormat: '<b>{point.percentage:.1f} %</b>'
   	    		},
   	    		plotOptions: {
   	    		    pie: {
   	    			    allowPointSelect: true,
   	    			    cursor: 'pointer',
                        depth: 35,
                        showInLegend: chartShowInLegend,
   	    	            point: {
   	    	                events: {
   	    	                    click: function () {
   	    	                        loadModalTable(this.x, this.name, this.y);
   	    	                    }
   	    	                }
   	    	            },									    
   	    			    dataLabels: {
   	    			        enabled: chartDataLabel,
   	    			        color: '#000000',
   	    			        connectorColor: '#000000',
   	    			        format: '<b>{point.name}</b>: {point.y:.0f}'
   	    	            }
   	    		    }
   	            },
                /*legend: {
                    useHTML: true,
                    labelFormatter: function () {
                        console.log(this);
                        var a = this.percentage
                        var nameO = '<span style="margin-right:5px;">' + this.name + '</span>    </tspan>'
                        var yValue = this.y === null ? 0 : this.y;
                        var pYO = '<span style="margin-right:5px;">' + yValue + '</span>  </tspan>'
                        var percentO = '<span>' + this.percentage.toFixed(2) + '%</span>  '

                        if( yValue === 0 ){
                            this.options.color = "#777"
                            console.log("dddd");
                            return null;
                        }
                        
                        var re = this.y === null ? null : pYO + nameO +  percentO ;
                        return re;
                    }
                },*/
                credits: {
                    enabled: false
                },		
   	    		series: [{
   	    		    data: []
   	    		}]
   	    	};

   	    	chart = Highcharts.chart('genl-pie-chart', options);
   	    	chart.series[0].setData(data);
   	    
        /*}catch(err){
   	    	console.log("Error: "+err);
   	    }*/
                      
    });
}


function loadModalTable(idStatus, name, value) {

    $("#myModalTable tr>td").remove();

    var dependency= $('#dependency option:selected').val();
    
    //Wainting animation
    document.getElementById('waintingAnimation').style.display = "inline-block";

    $.getJSON('./static/mock/project_detail.json', function(data) {        

        var rows;
        var strRows=""; 
    
        if(dependency == '14'){

            rows = jsonPath(data, "$.[?( @.id_estado_obra=='"+idStatus+"')]");
        }else{
            rows = jsonPath(data, "$.[?(@.dependency=='"+dependency+"' && @.id_estado_obra=='"+idStatus+"')]");
        }
        
        for (var i=0;i<rows.length;i++) {
            strRows = "";
            strRows += '<tr onclick="showModalInfoObra(this);">';
            strRows += setTD(i+1, 'number');
            //strRows += rows[i].project+"\n";                        
            strRows += setTD(rows[i].municipio, 'country');
            strRows += setTD(rows[i].categoria, 'categoria');
            strRows += setTD(rows[i].obra, 'obra');
            strRows += setTD(rows[i].empresa, 'empresa');
            strRows += setTD(rows[i].numero_contrato, 'numero_contrato');
            strRows += setTD(rows[i].monto_contrato, 'monto_contrato');
            strRows += setTD(rows[i].inicio_obra_segun_contrato, 'inicio_obra_segun_contrato');
            strRows += setTD(rows[i].termino_obra_segun_contrato, 'termino_obra_segun_contrato');
            strRows += setTD(rows[i].fecha_pago_anticipo, 'fecha_pago_anticipo');
            strRows += setTD(rows[i].monto_anticipo, 'monto_anticipo');
            strRows += setTD(rows[i].convenio_ampliacion_economico, 'convenio_ampliacion_economico');
            strRows += setTD(rows[i].monto_contrato_final, 'monto_contrato_final');
            strRows += setTD(rows[i].total_pagado, 'total_pagado');
            
            //If exist
            var apa = rows[i].anticipo_pendiente_amortizar ? rows[i].anticipo_pendiente_amortizar : "";
            strRows += setTD( apa , 'anticipo_pendiente_amortizar');  
            
            strRows += setTD(rows[i].avance_financiero, 'avance_financiero');
            strRows += setTD(rows[i].avance_fisico_verificado_por_la_contraloria, 'avance_fisico_verificado_por_la_contraloria');
            strRows += setTD(rows[i].entregada_al_beneficiario, 'entregada_al_beneficiario');
            strRows += setTD(rows[i].fecha_de_verificacion_contraloria, 'fecha_de_verificacion_contraloria');
            strRows += setTD(rows[i].estatus_verificado_por_la_contraloria, 'estatus_verificado_por_la_contraloria');
            
            //Registro fotografico
            var regFoto = rows[i].registro_fotografico ? rows[i].registro_fotografico : [] ; //If exist, get its array 
            var regFotoString = '';  //String of elements <img><img>
            if( regFoto.length > 0){
                 for( var fotoUrl in regFoto ){
                     regFotoString += '<img src="'+ regFoto[fotoUrl] +'" width=265 height=191 >';
                 }
            }
            strRows += setTD( regFotoString , 'registro_fotografico');   
            strRows += "</tr>\n";

            $("#myModalTable tbody").append(strRows);
        }
        
        $('#myModalTable').modal({ show: true });
    }).done(function() {
        document.getElementById('waintingAnimation').style.display = "none";
    });

}


function modalTemplateObraDetail(tds){

    document.getElementById('modal2Title').innerHTML = $(tds)[0].getElementsByClassName('obra')[0].innerHTML;

    var string = `
    <div class="container">
        <div class="row">
            <div class="col-md-4 order-md-2" id="colImageModalObraDeail">
                <div class="" class="registro_fotograficoField">`+ $(tds)[0].getElementsByClassName('registro_fotografico')[0].innerHTML +`</div>
                <div class="" id="mapaObraDetailField"> <img src="static/images/mapaEjemplo.jpg"> </div>
            </div>
            <div class="col-md-8 order-md-1">
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Municipio:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="municipioField">`+$(tds)[0].getElementsByClassName('country')[0].innerHTML+`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Categoría:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="categoriaField">`+ $(tds)[0].getElementsByClassName('categoria')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Empresa:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="empresaField">`+ $(tds)[0].getElementsByClassName('empresa')[0].innerHTML +`</span>    
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Número de contrato:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="numero_contratoField">`+ $(tds)[0].getElementsByClassName('numero_contrato')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Monto de contrato:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="monto_contratoField">`+ $(tds)[0].getElementsByClassName('monto_contrato')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Inicio de obra según contrato:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="inicio_obra_segun_contratoField">`+ $(tds)[0].getElementsByClassName('inicio_obra_segun_contrato')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Termino de obra según contrato:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="termino_obra_segun_contratoField">`+ $(tds)[0].getElementsByClassName('termino_obra_segun_contrato')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Fecha de pago anticipo:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="fecha_pago_anticipoField">`+ $(tds)[0].getElementsByClassName('fecha_pago_anticipo')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Monto anticipo:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="monto_anticipoField">`+ $(tds)[0].getElementsByClassName('monto_anticipo')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Convenio de apliación económico:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="convenio_ampliacion_economicoField">`+ $(tds)[0].getElementsByClassName('convenio_ampliacion_economico')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Monto contrato final:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="monto_contrato_finalField">`+ $(tds)[0].getElementsByClassName('monto_contrato_final')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Total pagado:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="total_pagadoField">`+ $(tds)[0].getElementsByClassName('total_pagado')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Anticipo pendiente amotizar:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="anticipo_pendiente_amortizarField">`+ $(tds)[0].getElementsByClassName('anticipo_pendiente_amortizar')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Avance financiero:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="avance_financieroField">`+ $(tds)[0].getElementsByClassName('avance_financiero')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Avance físico verificado por la contraloría:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="avance_fisico_verificado_por_la_contraloriaField">`+ $(tds)[0].getElementsByClassName('avance_fisico_verificado_por_la_contraloria')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Entregada al beneficiario:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="entregada_al_beneficiarioField">`+ $(tds)[0].getElementsByClassName('entregada_al_beneficiario')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Fecha de verificación contraloría:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="fecha_de_verificacion_contraloriaField">`+ $(tds)[0].getElementsByClassName('fecha_de_verificacion_contraloria')[0].innerHTML +`</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <span class="titleField">Estatus verificado por la contraloría:</span>
                    </div>
                    <div class="col-sm-6">
                        <span class="valueField" id="estatus_verificado_por_la_contraloriaField">`+ $(tds)[0].getElementsByClassName('estatus_verificado_por_la_contraloria')[0].innerHTML +`</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    return string;
}



/* Second modal */
function showModalInfoObra(tdElement){
    $('#modalInfoObra').modal({ show: true });
    stringContainer = modalTemplateObraDetail(tdElement) 
    $('#modalInfoObra .modal-body')[0].innerHTML = stringContainer;
}
$('#modalInfoObra').on('show', function() {
  	$('#myModalTable').css('opacity', .5);
  	$('#myModalTable').unbind();
    $('#myModalTable').find('[data-dismiss]').unbind();
});
$('#modalInfoObra').on('hidden', function() {
  	$('#myModalTable').css('opacity', 1);
});




$(document).ready(function () {

    //Button toggle for sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    //Select the dependency 
    $('#dependency').on('change', function() {
   	    var id = this.value;
        loadDataPieChart( id-1 );
  	});

});

