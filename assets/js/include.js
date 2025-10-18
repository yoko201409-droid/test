// /assets/js/include.js  （fetch部分は今のままでOK）
// 1) パーツ読み込み（既存）
(function () {
  document.querySelectorAll('[data-include]').forEach(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { credentials: 'same-origin', cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      el.outerHTML = html;
      document.dispatchEvent(new Event('partials:loaded'));
    } catch (e) {
      console.error('include failed:', url, e);
    }
  });
})();

// 2) 委譲でハンバーガー開閉（初期化いらず、安定）
(function hookHamburgerDelegation(){
  if (window.__hamburgerDelegated) return;
  window.__hamburgerDelegated = true;

  let tapLock = false;          // 連打ガード
  const toggleClasses = () => {
    const panel = document.querySelector('.h_main_list');
    if (!panel) return;
    panel.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  };

  // クリック/タップの委譲
  const onPress = (e) => {
    const t = e.target.closest('.h_list_menu a, .h_menu a, .h_main_list li.down > a');
    if (!t) return;

    // メニュー開閉ボタン
    if (t.matches('.h_list_menu a, .h_menu a')) {
      e.preventDefault();
      e.stopPropagation();                // 外側のクリック検知に届かせない
      if (tapLock) return;
      tapLock = true;
      toggleClasses();
      setTimeout(()=>{ tapLock = false; }, 200); // 200msの連打防止
      return;
    }

    // サブメニュー（EVENT）
    if (t.matches('.h_main_list li.down > a')) {
      e.preventDefault();
      e.stopPropagation();
      const sub = t.parentElement.nextElementSibling;
      if (sub && sub.classList.contains('sub_list')) {
        sub.classList.toggle('open');
      }
      return;
    }
  };

  // outside click で閉じる
  const onOutside = (e) => {
    const header = document.querySelector('header');
    const panel = document.querySelector('.h_main_list');
    if (!header || !panel) return;
    if (!header.contains(e.target)) {
      panel.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  };

  // PCクリック & モバイル（pointer）両対応
  document.addEventListener('click', onPress, true);      // captureで確実に先取り
  document.addEventListener('pointerup', onPress, true);
  document.addEventListener('click', onOutside);          // 外側はバブリング側でOK

  // パーツ差し込み後にも確実に生きる
  document.addEventListener('partials:loaded', () => {
    // 何もしなくてOK（委譲なので）
  });
})();
