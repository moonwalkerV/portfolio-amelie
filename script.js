// ============================================
// Amélie Philippon — Portfolio
// ============================================

(function () {
  // Marquee content — adapte la liste à tes vrais outils
  var tools = ["ChatGPT", "Notion", "Figma", "Canva", "Meta Ads", "Google Analytics", "Asana", "Midjourney"];
  var track = document.getElementById('marqueeTrack');
  if (track) {
    var html = '';
    for (var r = 0; r < 2; r++) {
      for (var i = 0; i < tools.length; i++) {
        html += '<span>' + tools[i] + '</span>';
      }
    }
    track.innerHTML = html;
  }

  // Barcode decoratif sur le badge
  var bc = document.getElementById('barcode');
  if (bc) {
    var bHtml = '';
    for (var b = 0; b < 22; b++) {
      var w = (b % 3 === 0) ? 2 : 1;
      var hpx = 10 + (b % 4) * 2;
      bHtml += '<i style="width:' + w + 'px;height:' + hpx + 'px;"></i>';
    }
    bc.innerHTML = bHtml;
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Parallax léger sur les mots de fond du hero (desktop uniquement)
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var words = document.querySelectorAll('.bg-word');
    window.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      words.forEach(function (w, i) {
        var depth = (i % 2 === 0) ? 10 : -14;
        w.style.transform = 'translate(' + (x * depth) + 'px,' + (y * depth * 0.6) + 'px)';
      });
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    items.forEach(function (el) { el.classList.add('in-view'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in-view'); });
  }
})();
