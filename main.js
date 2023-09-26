let countiesUrl ='https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let userUrl ='https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
let chart=d3.select("#chart");
let tooltip=d3.select("#tooltip");
let countyData;
let userData;


 let drawMap=()=>{
chart.selectAll('path')
        .data(countyData)
        .enter()  
        .append('path')
        .attr('d',d3.geoPath())//converts geometry into a string that can be given to the svg which the svg will use to draw the path
        .attr('class','county')
        .attr("fill",(countyDataitem)=>{
            let id=countyDataitem['id'] 
            let county=userData.find((item)=>{
            return item['fips']===id;
            })
            let percentage=county['bachelorsOrHigher']
            if(percentage <= 15){
                return 'lightgreen'
            }else if (percentage <= 30){
                return 'Limegreen'
            } else if (percentage <= 45){
                return 'Orange'
            } else{
                return 'green'
            } })
        .attr('data-fips',(countyDataitem)=>{
            return countyDataitem['id'];
        })
        .attr('data-education',(countyDataitem)=>{
            let id=countyDataitem['id'] 
            let county=userData.find((item)=>{
            return item['fips']===id;
            })
            let percentage=county['bachelorsOrHigher']
            return percentage;
        })
        .on("mouseover",(countyDataitem)=>{
           
            tooltip.transition()
                   .style("visibility",'visible')
          
            let id=countyDataitem['id'] 
            let county=userData.find((item)=>{
             return item['fips']===id;
            })

         tooltip.text(county['fips']+' || '+county['area_name']+' || '+ county['state'] +' : '+ county['bachelorsOrHigher']+'%') 
                .style("color","lightgreen")   
        tooltip .attr('data-education',(countyDataitem)=>{
            return countyDataitem['bachelorsOrHigher']
           
        })   
        })
        .on("mouseout",(countyDataitem)=>{
            tooltip.transition()
                   .style("visibility","hidden")
        })

}
 d3.json(countiesUrl).then(
    (data,error)=>{
        if(error){
            console.log(error)
        }else{
            countyData=topojson.feature(data,data.objects.counties).features;//should be converted into GeoJson first to use it with d3.js
                                                                    //which is an array of features
            d3.json(userUrl).then(
                (data,error)=>{
                    if(error){
                        console.log(error)
                    }else {
                        userData=data;
                        drawMap();
                    }
                }

            )
        }
    }
 )