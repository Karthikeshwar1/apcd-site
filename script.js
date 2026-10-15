document.documentElement.classList.add('js');
(function(){
  var live=document.getElementById('live');
  document.querySelectorAll('.code:not(.nocopy)').forEach(function(box){
    var b=document.createElement('button');
    b.type='button';b.textContent='Copy';
    b.setAttribute('aria-label','Copy to clipboard');
    b.onclick=function(){
      var t=box.querySelector('pre').innerText.trim();
      var done=function(){
        b.textContent='Copied';if(live)live.textContent='Copied';
        setTimeout(function(){b.textContent='Copy';if(live)live.textContent=''},1800);
      };
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,fallback)}else fallback();
      function fallback(){
        var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';
        document.body.appendChild(a);a.select();
        try{document.execCommand('copy');done()}catch(e){}
        document.body.removeChild(a);b.focus();
      }
    };
    box.appendChild(b);
  });

  // Tap to pause/play video + bulletproof autoplay
  var v = document.getElementById('demo-video');
  if (v) {
    v.muted = true;
    v.defaultMuted = true;

    // Force autoplay on page load across all browsers
    var startAutoplay = function(){
      var p = v.play();
      if (p !== undefined) {
        p.catch(function(){});
      }
    };
    if (v.readyState >= 2) {
      startAutoplay();
    } else {
      v.addEventListener('canplay', startAutoplay, { once: true });
      v.addEventListener('loadeddata', startAutoplay, { once: true });
    }

    // Toggle pause / resume on tap or click
    var toggleVideo = function(e){
      if (e) {
        e.preventDefault();
      }
      if (v.paused) {
        v.play();
      } else {
        v.pause();
      }
    };

    v.addEventListener('click', toggleVideo);
    // Touch support for responsive mobile screens
    var touchMoved = false;
    v.addEventListener('touchmove', function(){ touchMoved = true; }, { passive: true });
    v.addEventListener('touchend', function(e){
      if (!touchMoved) {
        toggleVideo(e);
      }
      touchMoved = false;
    });
  }
})();
