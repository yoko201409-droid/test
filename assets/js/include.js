// ===== 1) パーツ読み込み =====
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

// ===== 2) 参照キャッシュ =====
let $panel = null, $header = null;
function cacheHeaderNodes() {
  $panel  = document.querySelector('.h_main_list');
  $header = document.querySelector('header');
}
document.addEventListener('DOMContentLoaded', cacheHeaderNodes);
document.addEventListener('partials:loaded', cacheHeaderNodes);

// ===== 3) 開閉処理 =====
function openMenu() {
  if (!$panel) return;
  requestAnimationFrame(() => {
    $panel.classList.add('open');
    document.body.classList.add('nav-open');
  });
}
function closeMenu() {
  if (!$panel) return;
  requestAnimationFrame(() => {
    $panel.classList.remove('open');
    document.body.classList.remove('nav-open');
  });
}
function toggleMenu() {
  if (!$panel) return;
  if ($panel.classList.contains('open')) closeMenu(); else openMenu();
}
function toggleSubMenu(anchorEl) {
  const sub = anchorEl.parentElement?.nextElementSibling;
  if (sub && sub.classList.contains('sub_list')) {
    sub.classList.toggle('open');
  }
}

// ===== 4) イベント委譲（iPhone最適化） =====
(function bindDelegation(){
  if (window.__hamburgerDelegated) return;
  window.__hamburgerDelegated = true;

  let lastToggleAt = 0;
  const GUARD_MS = 220; // ダブル発火・ダブルタップ対策

  const pressHandler = (e) => {
    const aOrBtn = e.target.closest('a,button');
    if (!aOrBtn) return;

    const isMainToggle =
      aOrBtn.closest('.h_list_menu') || aOrBtn.closest('.h_menu');

    const isSubToggle =
      aOrBtn.matches('.h_main_list li.down > a');

    if (!isMainToggle && !isSubToggle) return;

    const now = performance.now();
    if (now - lastToggleAt < GUARD_MS) { e.preventDefault(); e.stopPropagation(); return; }
    lastToggleAt = now;

    e.preventDefault(); // iOSのダブルタップズーム/クリック遅延を抑止
    e.stopPropagation();

    if (isMainToggle) {
      toggleMenu();
      return;
    }
    if (isSubToggle) {
      toggleSubMenu(aOrBtn);
      return;
    }
  };

  // iPhone優先: touchstart を capture で最速取得
  document.addEventListener('touchstart', pressHandler, { capture: true, passive: false });
  // 予備（PCなど）
  document.addEventListener('click',       pressHandler, true);

  // 外側タップで閉じる（受動でOK）
  document.addEventListener('click', (e) => {
    if (!$header || !$panel) return;
    if (!$header.contains(e.target)) {
      closeMenu();
    }
  }, { passive: true });
})();
