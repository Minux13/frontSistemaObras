
//Archivos estaticos simulados json
var urlChartJson = './static/mock/15Mayo/plots15M.json';
var urlTableJson = '';


//Forma la grafica pie
function loadDataPieChart(dependency) {
    
    $.getJSON( urlChartJson , function(data) {
            
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
        

        //Crea un div con los legends
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
                                var dependency= $('#dependency option:selected').val();
                                var url = "./tablaCelular2.html" + "#" + dependency + "," + this.x;
                                window.open( url ,"_self");   
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
   	    
                      
    }).done(function() {
        ;
    })
    .fail(function(jqxhr, textStatus, error) {
        console.log( jqxhr);
        console.log( textStatus);
        console.log( error);
    })
    .always(function() {
        ;
    });
}





var listProjects = {
    
    createRow: function(numProject, nameProject, cityProject, categoriaProject, dependency, idProject ){
        var stringTag = `
         <div class="row tableAll"  idProject="`+ idProject +`" dependency="`+ dependency +`"  onclick="listProjects.goToDetail(this)" >
             <div class="col-sm-1 col-2 pl-sm-4 pl-0 pr-sm-4 pr-0 elemm1 ">
                 <div class="valueee">
                    ` + numProject + `
                 </div>
             </div>
             <div class="col-md-11 col-10 ">
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
    namesAsociatesProjects : ['',
        'INFRAESTRUCTURA',
        'ICIFED',
        'REA',
        'SADM',
        'SSNL',
        'CODETUR',
        'CODEFRONT',
        'FIDEPROES',
        'DIF',
        'FUNDIDORA',
        'CONALEP',
        'CAMINOS',
        'ISSSTELEON',
        'Total'
    ],
    sizeRowsPagination : 10,
    arrayTagsHTML : [],
    buttonTag : function(init, numValueButton, isActive){
        return '<button initL="'+ init +'" onclick="listProjects.actionPagination(this)" class="button_pag" '+isActive+'>'+ numValueButton +'</button>';
    },
    createAllButtons: function(){   //It runs only once when the buttons are created

        var numProjects = listProjects.arrayTagsHTML.length;
        var numProjecstShow = listProjects.sizeRowsPagination;
        var numButtons = Math.ceil(numProjects/numProjecstShow);
        
        var strAllButtons = '';
        for(var b=0; b<numButtons; b++ ){
            var init = b * listProjects.sizeRowsPagination;
            var numValueButton = b + 1;
            var isActive = b==0? 'active' : '';
            strAllButtons += listProjects.buttonTag( init, numValueButton, isActive )
        }
        document.getElementById('buttons_pagination').innerHTML = strAllButtons;
        
    },
    actionPagination: function( thisButton ){

        //List of projects
        var init =  parseInt( thisButton.getAttribute('initL') ) ;
        listProjects.setRowsPagination( init )
        
        //Behavior button
        $(".button_pag").removeAttr("active");
        $( thisButton ).attr('active','')

    },
    setRowsPagination: function(init){  //Sets and show the list of projects visible
        var size = listProjects.sizeRowsPagination;
        var stringList = '';
        for( var i=init; i<(init+size); i++ ){
            stringList += listProjects.arrayTagsHTML[i] ? listProjects.arrayTagsHTML[i] : '' ;
        }
        document.getElementById('table-obras').innerHTML = stringList;
    },
    initList: function ( dependency, idStatus ){
        
        document.getElementById('waintingAnimation').style.display = "block";

        var urlJson = './static/mock/15Mayo/dep'+ dependency +'.json'

        $.getJSON( urlJson , function(data) {

            var rows = jsonPath(data, "$.[?( @.id_estado_obra=='"+idStatus+"')]");

            //Create array of elemts HTML 
            for (var i=0;i<rows.length;i++) {
                listProjects.arrayTagsHTML.push( listProjects.createRow( i+1, rows[i].obra, rows[i].municipio, rows[i].categoria, dependency, rows[i].id_obra ));
            }
            
            listProjects.setRowsPagination( 0 );
            listProjects.createAllButtons();


            document.getElementById('titleDepartment').innerHTML = listProjects.namesAsociatesProjects[dependency]
            document.getElementById('nameDepartment').innerHTML = listProjects.namesAsociatesProjects[dependency]
        
        }).done(function() { ; })
          .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + " // " + error;
            console.log( "Request Failed: " + err );
            console.log(jqxhr);
        })
        .always(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        })
    },
    goToDetail : function ( thisTag ){

        var idObra = thisTag.getAttribute("idProject");
        var dependency = thisTag.getAttribute("dependency");
        var url = "./info2.html#" + dependency + ',' + idObra
        window.open( url ,"_self");   
    }
}



var detailProject = {
    
    createDetail: function ( dependency, idProject ){
        
        document.getElementById('waintingAnimation').style.display = "block";

        var urlJson = './static/mock/15Mayo/dep'+ dependency +'.json'

        $.getJSON( urlJson , function(data) {

            var fields = jsonPath(data, "$.[?( @.id_obra=='"+ idProject +"')]")[0];
            

            document.getElementById("municipioField").innerHTML = fields.municipio ;
            document.getElementById("categoriaField").innerHTML = fields.categoria ;
            document.getElementById("empresaField").innerHTML = fields.empresa ;
            document.getElementById("monto_contratoField").innerHTML = fields.monto_contrato ;
            document.getElementById("termino_obra_segun_contratoField").innerHTML = fields.termino_obra_segun_contrato ;
            document.getElementById("monto_anticipoField").innerHTML = fields.monto_anticipo ;
            document.getElementById("monto_contrato_finalField").innerHTML = fields.monto_contrato_final ;
            document.getElementById("anticipo_pendiente_amortizarField").innerHTML = fields.anticipo_pendiente_amortizar ;
            document.getElementById("numero_contratoField").innerHTML = fields.numero_contrato ;
            document.getElementById("inicio_obra_segun_contratoField").innerHTML = fields.inicio_obra_segun_contrato ;
            document.getElementById("fecha_pago_anticipoField").innerHTML = fields.fecha_pago_anticipo ;
            document.getElementById("convenio_ampliacion_economicoField").innerHTML = fields.convenio_ampliacion_economico ;
            document.getElementById("total_pagadoField").innerHTML = fields.total_pagado ;
            document.getElementById("fecha_de_verificacion_contraloriaField").innerHTML = fields.fecha_de_verificacion_contraloria ;
            document.getElementById("entregada_al_beneficiarioField").innerHTML = fields.entregada_al_beneficiario ;
            document.getElementById("estatus_verificado_por_la_contraloriaField").innerHTML = fields.estatus_verificado_por_la_contraloria ;

            var percentAF = fields.avance_financiero;
            document.getElementById('avance_financieroField').innerHTML = percentAF;
            var percentAFValue = '0';
            if( percentAF[ percentAF.length - 1 ] == '%' && !isNaN( percentAF.slice(0, -1) ) ){
                percentAFValue = percentAF;
            }
            $("#avance_financieroField").css('width', percentAFValue );
            
            var avanceFVC = fields.avance_fisico_verificado_por_la_contraloria;
            document.getElementById('avance_fisico_verificado_contraloriaField').innerHTML = avanceFVC;
            var avanceFVCValue = '0';
            if( avanceFVC[ avanceFVC.length - 1 ] == '%' && !isNaN( avanceFVC.slice(0, -1) ) ){
                avanceFVCValue = avanceFVC;
            }
            $("#avance_fisico_verificado_contraloriaField").css('width', avanceFVCValue );
            
            var registroFotografico = fields.registro_fotografico;
            var strRegFoto = '';
            for( var r in registroFotografico ){
                 strRegFoto += '<img src="'+ registroFotografico[r] +'" class="imagesInfoDetail" onclick="showModalImageZoom(this)" >'
            }
            
            document.getElementById('registro_fotograficoField').innerHTML = strRegFoto;
            
            ///Faltan ubicacion
            
            document.getElementById('titleDepartment').innerHTML = listProjects.namesAsociatesProjects[dependency];
            document.getElementById('nameDepartment').innerHTML = fields.obra ;
        
        }).done(function() { 
            document.getElementById('waintingAnimation').style.display = "none";
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + " // " + error;
            console.log( "Request Failed: " + err );
            console.log(jqxhr);
            document.getElementById('waintingAnimation').style.display = "none";
        })
        .always(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        })
    },
}

function showModalImageZoom(thisTag){
    document.getElementById('containerModalImageZoom').innerHTML = '<img src="'+thisTag.src+'" style="width: 500px;margin: 0 auto;max-width: 100%;">';
    $("#modalInfoObra tr>td").remove();
    $('#modalInfoObra').modal({ show: true });


}
