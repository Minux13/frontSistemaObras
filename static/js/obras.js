function setTD(el, className) {
    return '<td class="'+ className +'">'+el+'</td>';
}



var urlChartJson = './static/mock/15Mayo/plots15M.json';
var urlTableJson = './static/mock/15Mayo/project_detail15M.json';
function changeDate() {
    urlChartJson = './static/mock/plots.json';
    urlTableJson = './static/mock/project_detail.json';
}



function loadDataPieChart(dependency) {
    
    $.getJSON( urlChartJson , function(data) {
        //try {
   	        //var data = camposGPie[id-1].plots;
            console.log(urlChartJson);
            var plots;
            var strJSon = "[{}]";        
            plots = jsonPath(data, "$.[?(@.id=='"+dependency+"')].plots[*]");
            strJSon = JSON.stringify(plots);
            var data = JSON.parse(strJSon);

            var numTotales = 0; //Sum of all obras for titulo
            for(var dd in data){
                numTotales += parseInt(data[dd].y);
            }
            
            var chartShowInLegend = false;  //Deprecable
                
            var widthWindow = jQuery(window).width()
            
            var legendCh = '<div id="containerLegends">';
            for(var i in data){
                if(data[i].y == 0 || data[i].y == null ){
                    ;
                }else{
                    var shape = '<svg xmlns="http://www.w3.org/2000/svg"> <circle fill="'+ data[i].color +'" /> </svg>'
                    var spanY = '<span>'+ data[i].y +'</span>  '
                    var spanName = '<span>'+ data[i].name +'</span>  ';
                    var valuePercent = parseInt(data[i].y)*100/numTotales ;
                    var spanPercent = '<span>'+ Math.round(valuePercent*10)/10 +'%</span>  ';
                    legendCh += '<p class="legendRebanada"> '+ shape + spanY + spanName + spanPercent + '</p>';
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
                        showInLegend: false,
   	    	            point: {
   	    	                events: {
   	    	                    click: function () {
                                    window.open("/paginadoSistemaObras/tablaCelular2.html","_self");   
   	    	                        //loadModalTable(this.x, this.name, this.y);
   	    	                    },
                                legendItemClick: function(){
                                    this.slice(null);
                                    return false;
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
                        bb=this
                        var a = this.percentage
                        var styleText = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px;"  '
                        var nameO = '<span '+ styleText +'>' + this.name + '</span>    </tspan>'
                        var yValue = this.y === null ? 0 : this.y;
                        var pYO = '<span '+ styleText +'>' + yValue + '</span>  </tspan>'
                        var percentO = '<span '+ styleText +'>' + this.percentage.toFixed(2) + '%</span>  '

                        if( yValue === 0 ){
                            this.options.color = "#777"
                            this.legendGroup.element.style.display = "none"
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
                      
    }).done(function() {
    console.log( "second success" );
  })
  .fail(function(jqxhr, textStatus, error) {
    console.log( jqxhr);
    console.log( textStatus);
    console.log( error);
  })
  .always(function() {
    console.log( "complete" );
  });
}


function loadModalTable(idStatus, name, value) {
    $("#myModalTable tr>td").remove();

    var dependency= $('#dependency option:selected').val();
    
    //Wainting animation
    document.getElementById('waintingAnimation').style.display = "inline-block";

    $.getJSON( urlTableJson , function(data) {        


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
    }).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + " // " + error;
    console.log( "Request Failed: " + err );
    console.log(jqxhr);
  })
  .always(function() {
    console.log( "complete" );
  });

}




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


function tabl(){
    var t = $('.table')[0]
    var c = $('.portlet-body')[0]
    
    g = document.createElement('div');
    g.setAttribute("id", "obra-container-body");

    
    //#obra-container-body
    $(g).append(t)
    c.replaceWith(g)
    console.log(g);
    console.log($(g));
}


function openDetalleObra(){
    window.open("/paginadoSistemaObras/info.html","_self");   
}


function showModalImageZoom(thisTag){
    document.getElementById('containerModalImageZoom').innerHTML = '<img src="'+thisTag.src+'" style="width: 500px;margin: 0 auto;max-width: 100%;">';
    $("#modalInfoObra tr>td").remove();
    $('#modalInfoObra').modal({ show: true });


}
