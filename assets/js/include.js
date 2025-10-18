// /assets/js/include.js  ← JSのみ

// 1) パーツを読み込む
(function () {
  document.querySelectorAll('[data-include]').forEach(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { credentials: 'same-origin', cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      el.outerHTML = html; // ラッパーごと置換
      // 挿入完了イベントを飛ばす（これに反応して初期化する）
      document.dispatchEvent(new Event('partials:loaded'));
    } catch (e) {
      console.error('include failed:', url, e);
    }
  });
})();

// 2) メニュー初期化（必要なときに呼ぶ関数）
function initHeaderMenu(){
  const panel = document.querySelector('.h_main_list');
  const btns  = document.querySelectorAll('.h_list_menu a, .h_menu a');

  if (!panel || btns.length === 0) return;

  // 二重付与防止
  if (panel.dataset.inited === '1') return;
  panel.dataset.inited = '1';

  const toggle = (e) => {
    e.preventDefault();
    panel.classList.toggle('open');            // テーマに合わせて必要ならクラス名変更
    document.body.classList.toggle('nav-open');
  };

  btns.forEach((b) => b.addEventListener('click', toggle));

  // サブメニュー（EVENT）
  document.querySelectorAll('.h_main_list li.down > a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const sub = a.parentElement.nextElementSibling;
      if (sub && sub.classList.contains('sub_list')) {
        sub.classList.toggle('open');
      }
    });
  });

  // 画面外クリックで閉じる（任意）
  document.addEventListener('click', (e) => {
    const header = document.querySelector('header');
    if (!header) return;
    if (!header.contains(e.target)) {
      panel.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
}

// 3) ヘッダー挿入後＆通常読込時の両方で初期化を呼ぶ
document.addEventListener('partials:loaded', initHeaderMenu);
document.addEventListener('DOMContentLoaded', initHeaderMenu);
