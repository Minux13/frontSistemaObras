function setTD(el, className) {
    return '<td class="'+ className +'">'+el+'</td>';
}



var urlChartJson = './static/mock/15Mayo/plots15M.json';
var urlTableJson = './static/mock/15Mayo/project_detail15M.json';



function loadDataPieChart(dependency) {
    
    $.getJSON( urlChartJson , function(data) {
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
                                    window.open("./tablaCelular2.html","_self");   
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



var listProjects = {
    
    createRow: function(numProject, nameProject, cityProject, categoriaProject ){
        var stringTag = `
         <div class="row tableAll" onclick="listProjects.goToDetail()" >
             <div class="col-1 elemm1 ">
                 <div class="obranumerooo" ></div>
                 <div class="valueee">
                    ` + numProject + `
                 </div>
             </div>
             <div class="col-11">
                 <div class="valueee nameObraTable">
                    ` + nameProject + `
                 </div>
                 <div class="row  municipioYCategoria" >
                     <div class="col-md-6">
                         <div class="obramunicipiooo" ><i class="fas fa-map"></i> </div>
                         <div class="valueee ">
                            ` + cityProject + `
                         </div>
                     </div>
                     <div class="col-md-6">
                         <div class="obracategoriaaa" ><i class="fas fa-industry"></i> </div>
                         <div class="valueee ">
                            ` + categoriaProject + `
                         </div>
                     </div>
                  </div>
             </div>
         </div>
         `;
         return stringTag;
    },
    createList: function (){
        var stringList = '';
        stringList += this.createRow( 1, 'Remozamiento de Imagen Urbana y Restauración de Fachadas Del Centro Histórico de Bustamante, Nuevo León', 
                            'BUSTAMANTE', 
                            'REMODELACIÓN' );
        stringList += this.createRow( 2, 'REHABILITACION EN EL SISTEMA DE SEMAFORIZACION EN DIVERSAS CALLES DE LA CABECERA MUNICIPAL DE CADEREYTA JIMENEZ,N.L.', 
                            'CADEREYTA', 
                            'MANTENIMIENTO');
        stringList += this.createRow( 3, 'MEJORA DE UNIDAD DEPORTIVA ALFONSO MARTINEZ DOMINGUEZ EN CADEREYTA, N.L.', 
                            'CADEREYTA', 
                            'MANTENIMIENTO');
        stringList += this.createRow( 4, 'REHABILITACION DE UNIDAD DEPORTIVA RAUL GONZALEZ EN EL MUNICIPIO DE CHINA,N.L.', 'CHINA', 'MANTENIMIENTO');
        stringList += this.createRow( 5, 'RECONSTRUCCION Y MEJORAS EN CAPILLAS VELATORIAS, CHINA, N.L.',
                            'CHINA',
                            'RECONSTRUCCIÓN');
        stringList += this.createRow( 6, 'MEJORAS EN LA RED DE ALUMBRADO PÚBLICO EN LA COLONIA ALIANZA REAL, ESCOBEDO, N.L.',
                            'ESCOBEDO', 
                            'MANTENIMIENTO' );
        stringList += this.createRow( 7, 'CONSTRUCCION DE LA UNIDAD DE ESPECIALIDADES MEDICAS EN CIRUGIA AMBULATORIA, AVE CONSTITUCION ESQUINA CON AVE ART 27 S/N COL. PRIVADAS DE CAMINO REAL II, ESCOBEDO , N.L.',
                            'ESCOBEDO', 
                            'CONSTRUCCIÓN' );
        stringList += this.createRow( 8, 'PAVIMENTACIÓN DE LAS CALLES GOMEZ PALACIOS, DELICIAS, AGUASCALIENTES, ACUÑA PTE, ACUÑA OTE, CAMPECHE, SAN SALVADOR, SALVATIERRA, TEQUILA, Y ATOYAC EN LA COLONIA ALIANZA REAL, ESCOBEDO, N.L.', 
                            'ESCOBEDO', 
                            'PAVIMENTACIÓN' );

        document.getElementById('table-obras').innerHTML = stringList;

    },

    goToDetail : function (){
        window.open("./info2.html","_self");   
    }
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



function showModalImageZoom(thisTag){
    document.getElementById('containerModalImageZoom').innerHTML = '<img src="'+thisTag.src+'" style="width: 500px;margin: 0 auto;max-width: 100%;">';
    $("#modalInfoObra tr>td").remove();
    $('#modalInfoObra').modal({ show: true });


}
