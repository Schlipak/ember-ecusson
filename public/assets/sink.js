setTimeout(function() {
  var links = document.querySelectorAll('a');
  console.info("[SINK] Muting " + links.length + " anchor links");

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.getAttribute('href') == "#") {
      link.onclick = function(e) {
        e.preventDefault();
      }
    }
  }
}, 1500);
