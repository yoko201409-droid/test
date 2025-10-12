//ヘッダーの高さ分だけコンテンツを下げる
// $(function() {
//   var height=$("header").outerHeight();
//   $("body").css("margin-top", height);
//   if(window.innerWidth <= 992){
//     $(".h_list").css("top", height + "px");
//   }
// });

$(window).on('load', function() {
  const $fv = $('.fv_section');

  // ① 背景フェードイン
  $fv.addClass('show');

  // ② 背景が表示された後にロゴ・タイトルズーム
  setTimeout(function() {
    $fv.addClass('animate');
  }, 1000); // 背景フェード時間に合わせて

  // ③ ロゴ・タイトル表示が終わった後にプレイヤー出現
  setTimeout(function() {
    $fv.addClass('player-show');
  }, 3000); // 2秒 + 1.8秒 = 約4秒後
});



$(function() {
  $(window).on("scroll", function() {
    let scrollTop = $(window).scrollTop();
    let windowHeight = $(window).height();
    let infoTop = $(".info_section").offset().top;

    if (scrollTop + windowHeight > infoTop) {
      $(".fix_section.fix_top").addClass("show");
    } else {
      $(".fix_section.fix_top").removeClass("show");
    }
  });
});

// ハンバーガーメニュー
$(function() {
  $('.h_menu').click(function() {
      $('.h_list').toggleClass('is_open');
      $('.down>a').removeClass('is_sub_open');
      $('.sub_list').slideUp();
      $('.bg_section').toggleClass('is_bg');
      $("body,html").toggleClass("over_hidden");
  });
  $('.down').click(function(){
      $(this).find('> a').toggleClass('is_sub_open');
      $('.sub_list').slideToggle();
  });
  $('.bg_section,.h_list_menu').click(function() {
      $('.h_list').removeClass('is_open');
      $('.down>a').removeClass('is_sub_open');
      $('.sub_list').slideUp();
      $('.bg_section').removeClass('is_bg');
      $("body,html").removeClass("over_hidden");
  });
});

$(document).ready(function(){
  // 初期状態で非表示
  $(".c_accord_inside").hide();

  $(".c_accord_box .c_accord_push").click(function(){
      // 他を閉じる
      $(".c_accord_box").not($(this).parent()).find(".c_accord_inside").slideUp();
      $(".c_accord_box").not($(this).parent()).find(".c_accord_push").removeClass('is_after');

      // 自分の中の .c_accord_inside を開閉
      $(this).next(".c_accord_inside").slideToggle();

      // 自分にクラスを付与
      $(this).toggleClass('is_after');
  });
});

$(document).ready(function() {
  var headerHeight = 200;

  // ページ内リンククリック時のスクロール
  $('[href*="#"]').click(function(){
    var href = $(this).attr("href");
    var targetId = href.split('#')[1];
    var target = $('#' + targetId);

    if (target.length) {
      var position = target.offset().top - headerHeight;
      $("html, body").animate({scrollTop: position}, 200, "swing");
    }

    if(window.innerWidth <= 992){
      $("body,html").removeClass("over_hidden");
      $('.bg_section').removeClass('is_bg');
      $('.h_menu>a').removeClass('is_open');
      $('.h_list').slideUp();
    }
  });

  setTimeout(function() {
    var hash = window.location.hash;
    if (hash) {
      var target = $(hash);
      if (target.length) {
        var position = target.offset().top - headerHeight;
        $("html, body").animate({scrollTop: position}, 200, "swing");
      }
    }
  }, 300);
});

$(window).on('load resize', function () {
  const isMobile = $(window).width() <= 992;

  // 共通の関数にまとめてスッキリ
  function resizeAndShow($elements, scaleMobile, scaleDesktop) {
    $elements.each(function () {
      const $img = $(this);
      const w = this.naturalWidth;
      // const h = this.naturalHeight;
      const scale = isMobile ? scaleMobile : scaleDesktop;

      $img.css({
        width: w * scale + 'px',
        // height: h * scale + 'px',
        visibility: 'visible' // サイズ設定後に表示
      });
    });
  }

  // 適用
  resizeAndShow($('.event_box>h2>img, .tggo_box>h2>span>img, .png_title'), 0.5, 0.7);
  resizeAndShow($('.player_img'), 0.3, 0.4);
});

$(function(){
  function fadeInElements() {
    $('.fadein, .player_img, .title_img').each(function(){
      var elemPos = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      if (scroll > elemPos - windowHeight + 50){
        $(this).addClass('scrollin');
      }
    });
  }

  // ページ読み込み時にも実行
  fadeInElements();

  $(window).scroll(function (){
    fadeInElements();
  });
});

$(function() {
  var $btn = $('.event_all_btn');
  var offsetTop = $btn.offset().top;
  var btnHeight = $btn.outerHeight();
  var isFixed = false;

  $(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop();

    if (scrollTop >= offsetTop && !isFixed) {
      // 固定時にダミー要素を挿入
      $btn.after('<div class="btn-placeholder" style="height:' + btnHeight + 'px"></div>');
      $btn.addClass('fixed');
      $('.h_menu').css('display','none');
      isFixed = true;
    } else if (scrollTop < offsetTop && isFixed) {
      // 元に戻す
      $('.btn-placeholder').remove();
      $btn.removeClass('fixed');
      $('.h_menu').css('display','block');
      isFixed = false;
    }
  });
});

$(window).on('load resize', function() {
  let maxHeight = 0;

  // いったんリセット
  $('.c_accord_push').css('height', 'auto');

  // 一番高い高さを取得
  $('.c_accord_push').each(function() {
    const thisHeight = $(this).outerHeight();
    if (thisHeight > maxHeight) {
      maxHeight = thisHeight;
    }
  });

  // 全ての要素に最大値を適用
  $('.c_accord_push').height(maxHeight);
});

$(window).on('load resize', function(){
  let maxWidth = 0;

  // span の中で最も幅が広いものを取得
  $('.c_list >li > span').each(function(){
    const width = $(this).outerWidth();
    if (width > maxWidth) {
      maxWidth = width;
    }
  });

  // その幅を全 span に適用
  $('.c_list >li > span').css('width', maxWidth + 'px');
});
