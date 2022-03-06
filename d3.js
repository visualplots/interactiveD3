/////////// DISTANCIA /////////
var margin = {top: 100, right: 200, bottom: 130, left: 100},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

/////////// AÑADIR AL DIV /////////
var svg = d3.select("#lineas").append("svg")
.attr("width", width + margin.left + margin.right + 15000)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
"translate(" + margin.left + "," + margin.top + ")");


function dibujar(){

   // Eliminar para volver a pintar
   svg.selectAll('*').remove(); 
   
    // Cargamos los datos
   d3.csv("https://raw.githubusercontent.com/AJM05/Bdata3-Visualizaci-n-datos/main/Examen/examen_visu.csv", function(error, data) {

   if (error) throw error;
   
    // Para parsear fechas
   var parseTime = d3.timeParse("%Y-%m-%d")

   //formato de los datos
   data.forEach(function(d) {
       d.Date = parseTime(d.Date);
       d.Valor_1 = +d.Valor_1;
       d.Valor_2 = +d.Valor_2;

   });

   // ordenamos las fechas
   data.sort(function(a,b){
       return new Date(b.Date) - new Date(a.Date);
   });


   /////////// RESPONISIVE /////////
   // Adecuar la anchura
   currentWidth = parseInt(d3.select('#lineas').style('width'), 10) - margin.left - margin.right

   
   /////////// EJE X /////////
   // Definir escala de X
   var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.Date; }))
        .range([ 0, currentWidth]); 
   
   // Definir función de grid X
   function lineas_ref_x(){
        return d3.axisBottom(x)
            .ticks(6)
        }
   
   // Pintar GRID X
   svg.append("g")
    .attr("class","grid")
    .attr("transform","translate(0," + height + ")")
    .call(lineas_ref_x().tickSize(-height).tickFormat(""))

   // Pintar eje X
    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(0," + height + ")")     
        .call(d3.axisBottom(x)).selectAll("text")
        .attr("text-anchor","end")
        .attr("dx","-.9em")
        .attr("dy",".13em")
        .attr("transform","rotate(-45)");

    // Título de eje X
    svg.append("text")
        .attr("class", "subtit")
        .attr("x", currentWidth / 2)                     
        .attr("y", height + margin.top - 40)                    
        .attr("text-anchor", "middle")
        .attr("font-weight", 'bold')
        .attr("font-size", '20px')
        .attr("fill", "#2E74B5")
        .text("Fecha")
   
   /////////// EJE Y /////////          
   // Definir escala de Y
   var y =  d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Valor_1;})])
        .range([height, 0]);

    // Definir función de grid Y
    function lineas_ref_y(){
        return d3.axisLeft(y)
                .ticks(6)
    } 

    // Pintar GRID Y
    svg.append("g")
    .attr("class","grid")
    .call(lineas_ref_y().tickSize(-currentWidth).tickFormat(""))
   
   // Pintar eje Y
    svg.append("g").attr("class","eje")
        .call(d3.axisLeft(y));

    // Título de eje Y
    svg.append("text")
    .attr("class","subtit")
    .attr("transform","rotate(-90)")               
    .attr("y", -10 - margin.left / 2)
    .attr("x", 0 - (height / 2))
    .attr("text-anchor","middle")
    .attr("dy", "1em")
    .attr("font-weight", 'bold')
    .attr("font-size", '20px')
    .attr("fill", "#2E74B5")
    .text("Impacto vía web")

    /////////// EJE Y2 /////////          
    // Definir escala de Y2
    var y2 = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return +d.Valor_2;})])
          .range([height, 0]);
        
    // Pintar eje Y2
    svg.append("g").attr("class","eje")
        .attr("transform", "translate(" + currentWidth + ", 0)")
        .call(d3.axisRight(y2))
        //.call(d3.axisLeft(y2))
        //.selectAll("text")
        //.attr("text-anchor", "start")                         
        //.attr("transform", "translate(" + 15 + ", 0)");


    // Título de eje Y2
    svg.append("text")
        .attr("class","subtit")
        .attr("transform","rotate(-90)")                    
        .attr("y", currentWidth + 60)                       
        .attr("x", 15 - (height / 2))
        .attr("text-anchor","middle")
        .attr("font-weight", 'bold')
        .attr("font-size", '20px')
        .attr("fill", "#2E74B5")
        .attr("dy", "1em")
        .text("Euros")

    /////////// TÍTULO /////////          
    svg.append("text")
    .attr("class","titulo")
    .attr("x", currentWidth / 2 )
    .attr("y", - 25)
    .attr("text-anchor", "middle")
    .attr("fill", "#1F4E79")
    .attr("font-weight", 'bold')
    .attr("font-size", '34px')
    .attr("text-decoration", "underline")
    .text("Impacto web vs dinero generado");

    ///////// PINTAR DATOS ///////// 
   
    // Pintar línea
   svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#00B0F0")
          .attr("d", d3.line()
            .x(function(d) { return x(d.Date) })
            .y(function(d) { return y(d.Valor_1)})
            )   
    // Pintar los puntos
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function (d) { return x(d.Date); } )
        .attr("cy", function (d) { return y2(d.Valor_2); } )
        .attr("r", 1)
        .attr("fill", "#7030A0")
});

}

window.onload = dibujar();
window.addEventListener('resize', dibujar);
