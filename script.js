document.documentElement.classList.add('js');
(function(){
  var live=document.getElementById('live');
  document.querySelectorAll('.code').forEach(function(box){
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
})();
