//スライド上の設定
	$('.slider-top').slick({
		accessibility: false,// 左右矢印ボタンでの切り替えなし
		arrows: false,//左右矢印ボタン表示なし
		autoplay: true,//自動的に動き出すか。初期値はfalse。
		pauseOnHover: false,//オンマウスでスライドを一時停止させるかどうか。初期値はtrue。
		pauseOnFocus: false,//フォーカスした際にスライドを一時停止させるかどうか。初期値はtrue。
		slidesToShow: 1,//スライドを画面に1枚見せる
		slidesToScroll: 1,//1回のスクロールで1枚の写真を移動して見せる
		swipe: false,//タッチスワイプに対応しない
	});
//スライド下の設定
	$('.slider-bottom').slick({
		accessibility: false,// 左右矢印ボタンでの切り替えなし
		arrows: false,//左右矢印ボタン表示なし
		autoplay: true,//自動的に動き出すか。初期値はfalse。
		pauseOnHover: false,//オンマウスでスライドを一時停止させるかどうか。初期値はtrue。
		pauseOnFocus: false,//フォーカスした際にスライドを一時停止させるかどうか。初期値はtrue。
		slidesToShow: 1,//スライドを画面に1枚見せる
		slidesToScroll: 1,//1回のスクロールで1枚の写真を移動して見せる
		swipe: false,//タッチスワイプに対応しない
		rtl: true,//スライダの表示方向を左⇒右に変更する
	});


	// トップメニューバー
// メニューバーの要素を取得
const menu = document.getElementById('top-rod');

// スクロール位置が50px以上になったらメニューを表示
window.addEventListener('scroll', () => {
	// 現在のスクロール位置
	const scrollPosition = window.scrollY;

	// スクロール位置が50px以上になったらメニューを表示
	if (scrollPosition > 50) {
		menu.classList.add('top-rod-transparent');
		menu.style.top = '0';  // メニューを画面上に表示
	} else {
		menu.classList.remove('top-rod-transparent');
		menu.style.top = '-50px'; // メニューを隠す
	}
});

document.addEventListener("DOMContentLoaded", function () {
    const fadeInElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show"); // 表示アニメーションを適用
            }
        });
    }, {
        threshold: 0.2, // 20%見えたら発火
        rootMargin: "0px 0px -50px 0px" // 画面の下より少し上で発火
    });

    fadeInElements.forEach((el) => observer.observe(el));
});


window.addEventListener('scroll', function () {
	const imageContainers = document.querySelectorAll('.image-container');
  
	imageContainers.forEach((container) => {
	  const image1 = container.querySelector('.image1');
	  const image2 = container.querySelector('.image2');
	  const image3 = container.querySelector('.image3');
	  const image4 = container.querySelector('.image4');
  
	  const rect = container.getBoundingClientRect();
  
	  // 要素が画面に入った時にアニメーションを実行
	  if (rect.top <= window.innerHeight && rect.bottom >= 0) {
		// 最初の画像セットのアニメーション
		if (image1 && image2) {
		  image1.classList.add('show-image1');
		  setTimeout(() => {
			image2.classList.add('show-image2');
		  }, 1000);
		}
  
		// 次の画像セットのアニメーション（中央の画像セット）
		if (image3 && image4) {
		  image3.classList.add('show-image3');
		  setTimeout(() => {
			image4.classList.add('show-image4');
		  }, 1000);
		}
	  }
	});
  });
  
  
