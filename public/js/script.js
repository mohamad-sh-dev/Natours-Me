
export const displayMap = (locations)=>{
  mapboxgl.accessToken = 'pk.eyJ1IjoibW9oYW1hZHNoeCIsImEiOiJja2xtaWU4d3IwOWhiMnVuM2h6anJ5M3N4In0.Qv__8Mmnnyqoy0M8w89XHg';
  var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mohamadshx/cklml1b103exu18nyzes5nkyw'
  });
  
  const bounds = new mapboxgl.LngLatBounds();
  
  locations.forEach(loc => {
  
    let el = document.createElement('div')
    el.className = "marker";
    
  
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    }).setLngLat(loc.coordinates).addTo(map)
  
    
    new mapboxgl.Popup({
      offset:30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day} : ${loc.description}</p> `).addTo(map)
    
    bounds.extend(loc.coordinates)
    
  });
   
  map.fitBounds(bounds,{
    padding:{
      top : 200,
      bottom:150,
      left:100,
      right:100
    }
  })


}