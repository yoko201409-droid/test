<!-- /assets/js/include.js -->
<script>
(function(){
  document.querySelectorAll('[data-include]').forEach(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { credentials: 'same-origin', cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      el.outerHTML = html; // ラッパーごと置換
    } catch (e) {
      console.error('include failed:', url, e);
    }
  });
})();
</script>
