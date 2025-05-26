let isSerie = document.getElementById('serie');
let isMovie = document.getElementById('movie');

let types = document.querySelectorAll('input[type=radio][name=type]');

types.forEach(type => {
    type.addEventListener('change', () =>{
        if (type.value == "movie") {
            document.getElementById('season-selector').style.display = "none";
        } else if (type.value == "serie"){
            document.getElementById('season-selector').style.display = "block";
        }
    })
})


function convertMinutes(minutess){
    let hours = Math.floor(minutess / 60) ,
    minutes = Math.floor(minutess % 60),
    total = '';

    if (minutess < 60){
        total = `${minutes}m`
        return total
    } else if (minutess > 60){
      total = `${hours}h ${minutes}m`
      return total
    } else if (minutess = 60){
        total = `${hours}h`
        return total
    }
}


function generar() {
    let serieKey = document.getElementById('numero').value;
    let languaje = "es-MX"
    let seasonNumber = document.getElementById('numeroTemporada').value;

    const cargarPeliculas = async() => {

        if (isSerie.checked) {
            try {

                const respuesta = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
                const respuesta3 = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}/season/${seasonNumber}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
    
                if (respuesta.status === 200) {
                    const datos = await respuesta.json();
                    const datosTemporada = await respuesta3.json();
                    console.log(datos)
                    let tags = '';
    
                    datos.genres.forEach((genre, index) => {
                        if (index > 2) {
                            return
                        }
                        tags += `${genre.name},`          

                    });

                       
                    let episodeList = '';
    
                    datosTemporada.episodes.forEach(episode => {
                        let runtime ;
                        if (episode.runtime != null) {
                            runtime = convertMinutes(episode.runtime);
                        } else {
                            runtime = ''
                        }
                        episodeList += `
                        <a href="__URL__" class="episode" data-url="__URL__" target="_blank" rel="nofollow">${episode.episode_number}</a>
                        `
                    })
    
                    let seasonsOption = '';
    
                    datos.seasons.forEach(season => {
                        
                        if(season.name != "Especiales"){
                            seasonsOption += `<!-- SEASON NUMERO ${seasonNumber} -->
                            `
                        }
                    })
    
                    let genSeasonsCount;
    
                    if (datos.number_of_seasons == 1){
                        genSeasonsCount = " Temporada"
                    } else if (datos.number_of_seasons > 1){
                        genSeasonsCount = " Temporadas"
                    }
                    
                    let template = document.getElementById('html-final');
    
                    let justHtml = `
                    <!--EXTRA INFO
${datos.name}
Serie,${tags}${datos.first_air_date.slice(0,4)},

-->  
                    <style>
  a.episode {
    text-decoration: none;
    color: #ffffff;
    padding: 5px;
    display: inline-block;
    margin: 2px;
  }

  a.episode.active {
    background-color:rgb(212, 62, 62);
    color: white;
    border-radius: 4px;
  }
</style>

<div class="separator" style="clear: both;"><a href="" style="display: block; padding: 1em 0; text-align: center; "><img alt="" border="0" data-original-height="553" data-original-width="522" src="https://image.tmdb.org/t/p/w500/${datos.poster_path}"/></a></div>
<p>${datos.overview}</p>
<p style="color: #1c1b1b;">  </p>

<style>
.entry-download {
    display: grid !important;
    grid-template-columns: repeat(10, 1fr) !important;
}
  .entry-button {
  padding-bottom: .6rem !important;
  }
  .entry-button .btn {
    margin-bottom:.1rem !important}
</style>

<iframe 
  id="videoPlayer" class='lazyload' 
  data-src="__URL__" 
  src="___URL__"
  title="Video player" frameborder="0"sandbox="allow-scripts allow-same-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
</iframe>


<div id="seasonTitle" style="
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin: 15px 0 12px 0;
  padding: 6px 12px;
  background-color: #d90000;
  user-select: none;
  max-width: fit-content;
  border-radius: 0;
  box-shadow: none;
  border: none;
">
  Temporada __N__
</div>
<div id="episodes">
  <!-- Agrega todos los episodios aquí -->
${episodeList}


</div>

<script>
    const links = document.querySelectorAll('a[data-url]');
    const iframe = document.getElementById('videoPlayer');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evita  el enlace navegue a otro lugar
            const newUrl = this.getAttribute('data-url');
            iframe.src = newUrl; // Cambia la URL del iframe
        });
    });
</script>

<script>
  const videoPlayer = document.getElementById('videoPlayer');
  const episodeLinks = document.querySelectorAll('.episode');

  episodeLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Cambiar el src del iframe
      const url = this.getAttribute('data-url');
      videoPlayer.src = url;

      // Remover clase 'active' de todos
      episodeLinks.forEach(el => el.classList.remove('active'));

      // Agregar clase 'active' al clicado
      this.classList.add('active');
    });
  });
</script>

<!--PEGAR SCRIPT ABAJO-->


                    `;
                    
                    let seasonOnly = `
                    <!--SEASON NUMERO ${seasonNumber}-->
                    ${episodeList}
                    <!--Siguiente temporada debajo-->

                    `;
    
                    const btnCopiar = document.getElementById('copiar');
    
                    if (seasonNumber == 1) {
                        template.innerText = justHtml;
                    } else if (seasonNumber > 1){
                        template.innerText = seasonOnly;
                    }
    
                    let templateHTML = template.innerText;
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })

                    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.name;
                    genSeasons.innerText = datos.number_of_seasons + genSeasonsCount;
                    genYear.innerText = datos.first_air_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }
        } else
        if(isMovie.checked){
            try {

            const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                let tags = '';
                console.log(datos)


                datos.genres.forEach((genre, index) => {
                    if (index > 2) {
                        return
                    }
                    tags += `${genre.name},`          

                });


                    let template = document.getElementById('html-final');

                    let justHtml = `<!-- extra
${datos.title}

Movie,${tags}${datos.release_date.slice(0,4)},


-->

<div class="separator" style="clear: both;"><a href="" style="display: block; padding: 1em 0; text-align: center; "><img alt="" border="0" data-original-height="553" data-original-width="522" src="https://image.tmdb.org/t/p/w500/${datos.poster_path}"/></a></div>

<p>${datos.overview}</p>
<p style="color: #1c1b1b;">  </p>


<iframe 
  id="videoPlayer" class='lazyload' 
  data-src="__URL__" 
  src="___URL__"
  title="Video player" frameborder="0"sandbox="allow-scripts allow-same-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
</iframe>


<script>
    const links = document.querySelectorAll('a[data-url]');
    const iframe = document.getElementById('videoPlayer');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evita  el enlace navegue a otro lugar
            const newUrl = this.getAttribute('data-url');
            iframe.src = newUrl; // Cambia la URL del iframe
        });
    });
</script>

<!-- WEB CAST Y 1DM -->

<!--FINAL-->

`;                  
                    template.innerText = justHtml;
                    let templateHTML = template.innerText;
                    
                    const btnCopiar = document.getElementById('copiar');
                    
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })
    
    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.title;
                    genSeasons.innerText = "";
                    genYear.innerText = datos.release_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }           
        }

    }

    cargarPeliculas();
}

generar();


