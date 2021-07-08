<ul>
<li><s>
problem in <a href="src/js/profile.js"> profile.js </a> where the photo gets loaded aftere the request is sent 
</br></br>
solution is making a modal to preview the picture and confirm the changing ( i guess)
</s>
solved
</br></br>
<li><s> the like button doesnt work ( probblem with firebase rules probably)</s></li>
kinda solved but securety rules are like... ugh not secure at all
</br></br>
<li> side post doesn't update when liked or unliked because we querie it using <strong>ref.get()</strong> , we should use snapshot instead
