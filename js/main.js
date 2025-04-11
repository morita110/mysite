{
    document.addEventListener("DOMContentLoaded", function() {
        const overlay = document.getElementById("modalOverlay");
        const closeModal = document.getElementById("closeModal");
        const modal = document.querySelector(".modal");
    
        // ページ読み込み時にモーダルを表示
        setTimeout(() => {
            overlay.classList.add("show");
        }, 500);
    
        // ✖ボタンをクリックでモーダルを閉じる
        closeModal.addEventListener("click", function() {
            overlay.classList.remove("show");
        });
    
        // オーバーレイ部分をクリックしてモーダルを閉じる
        overlay.addEventListener("click", function() {
            overlay.classList.remove("show");
        });
    
        // モーダル内部をクリックしてもモーダルが閉じないようにする
        modal.addEventListener("click", function(event) {
            event.stopPropagation();
        });
    });
}





{
    const container = document.querySelector('.slider-container');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // ★★★ テキストスライダー用の要素を取得 ★★★
    const textSliderContainer = document.querySelector('.text-slider-container');
    const textSliderWrapper = document.querySelector('.text-slider-wrapper');
    // textContentArea, titleEl などは不要に

    const originalImageSources = [
      { src: "img/slider_ice03.png", alt: "Image 1: Landscape", title: "牧場搾りたて", subtitle: "朝搾った牛乳のみ使用", description: "澄み切った青空の下、雪を頂いた山々が連なる壮大な連峰に抱かれた乳牛たちのおすそわけから作った貴重なアイスです" },
      { src: "img/slider_ice02.png", alt: "Image 2: River", title: "ベストマッチング", subtitle: "こだわりの原材料", description: "良い材料を使えば美味しいものができるわけではありません。使用する原材料ひとつひとつにこだわり、一番バランスが良いものだけを厳選しています" },
      { src: "img/slider_ice04.png", alt: "Image 3: Forest", title: "放し飼いの鶏", subtitle: "初めてのたまご", description: "この卵に初めて出会ったときの衝撃は忘れられません。放し飼いにした鶏に、オーガニックのえさを与え栄養価の高い、濃い味になっています" },
      { src: "img/slider_ice01.png", alt: "Image 4: City", title: "どこまでもなめらか", subtitle: "食べる人のことを想う", description: "口に入れたときのまろやかな舌触りを実現するためオリジナルの西方" },
    ];

    let imageSlides = []; // 画像スライド要素の配列
    let textSlides = []; // テキストスライド要素の配列
    let currentIndex = 0;
    let slideWidth = 0;
    const slideMargin = 20;
    let containerWidth = 0;
    let textContainerWidth = 0; // テキストコンテナの幅
    let isTransitioning = false;
    let totalSlidesIncludingClones = 0;

    // 画像スライド生成関数
    function createImageSlide(src, alt) {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide');
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.onload = checkAllImagesLoaded;
        img.onerror = checkAllImagesLoaded;
        slideDiv.appendChild(img);
        return slideDiv;
    }

    // ★★★ テキストスライド生成関数 ★★★
    function createTextSlide(data) {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('text-slide');

        const titleEl = document.createElement('h3');
        titleEl.textContent = data.title || '';
        slideDiv.appendChild(titleEl);

        const subtitleEl = document.createElement('h4');
        subtitleEl.textContent = data.subtitle || '';
        slideDiv.appendChild(subtitleEl);

        const descriptionEl = document.createElement('p');
        descriptionEl.textContent = data.description || '';
        slideDiv.appendChild(descriptionEl);

        return slideDiv;
    }


    function setupSlider() {
        // 画像スライドとテキストスライドを生成
        originalImageSources.forEach(imgData => {
            sliderWrapper.appendChild(createImageSlide(imgData.src, imgData.alt));
            textSliderWrapper.appendChild(createTextSlide(imgData)); // テキストスライドも生成
        });

        const originalImageSlides = Array.from(sliderWrapper.children);
        const originalTextSlides = Array.from(textSliderWrapper.children); // テキストスライドも取得
        if (originalImageSlides.length === 0) return;

        // 画像クローン
        const firstImageClone = originalImageSlides[0].cloneNode(true);
        const lastImageClone = originalImageSlides[originalImageSlides.length - 1].cloneNode(true);
        sliderWrapper.appendChild(firstImageClone);
        sliderWrapper.insertBefore(lastImageClone, originalImageSlides[0]);

        // ★★★ テキストクローン ★★★
        const firstTextClone = originalTextSlides[0].cloneNode(true);
        const lastTextClone = originalTextSlides[originalTextSlides.length - 1].cloneNode(true);
        textSliderWrapper.appendChild(firstTextClone);
        textSliderWrapper.insertBefore(lastTextClone, originalTextSlides[0]);

        imageSlides = Array.from(sliderWrapper.children);
        textSlides = Array.from(textSliderWrapper.children); // テキストスライド配列も更新
        totalSlidesIncludingClones = imageSlides.length; // 画像とテキストの数は同じはず

        currentIndex = 0;
        const initialEffectiveIndex = 1;

        // トランジションを一時的に無効化
        sliderWrapper.style.transition = 'none';
        textSliderWrapper.style.transition = 'none'; // テキストも

        calculateDimensions(); // 寸法計算

        // 初期位置計算と適用
        const initialTransform = getTargetTransformX(initialEffectiveIndex);
        sliderWrapper.style.transform = `translateX(${initialTransform}px)`;
        // ★★★ テキストラッパーにも同じ transform を適用 ★★★
        // テキストはコンテナ幅いっぱいに表示するので、画像と同じ移動量でOK
        textSliderWrapper.style.transform = `translateX(-${initialEffectiveIndex * textContainerWidth}px)`; // テキストは単純にインデックス分移動

        // updateTextContent は不要に

        // 少し待ってからトランジションを有効化
        setTimeout(() => {
            const transitionStyle = 'transform 0.5s ease-in-out';
            sliderWrapper.style.transition = transitionStyle;
            textSliderWrapper.style.transition = transitionStyle; // テキストも
        }, 50);

        checkAllImagesLoaded();
    }

    let imagesLoadedCount = 0;
    let imagesErroredCount = 0;
    let totalImagesAttempted = 0;

    function checkAllImagesLoaded() {
        // 画像の読み込みだけチェックすればOK
        totalImagesAttempted = imageSlides.length;
        imagesLoadedCount = imageSlides.filter(s => s.querySelector('img')?.complete && s.querySelector('img')?.naturalHeight !== 0).length;
        imagesErroredCount = imageSlides.filter(s => s.querySelector('img')?.complete && s.querySelector('img')?.naturalHeight === 0).length;

        if (imagesLoadedCount + imagesErroredCount === totalImagesAttempted) {
            const currentImageTransition = sliderWrapper.style.transition;
            const currentTextTransition = textSliderWrapper.style.transition;

            sliderWrapper.style.transition = 'none';
            textSliderWrapper.style.transition = 'none';
            calculateDimensions(); // 寸法再計算

            // 現在のスライド位置を再計算して適用
            const effectiveIndex = currentIndex + 1;
            const targetImageTransform = getTargetTransformX(effectiveIndex);
            sliderWrapper.style.transform = `translateX(${targetImageTransform}px)`;
            // ★★★ テキストの位置も再計算して適用 ★★★
            textSliderWrapper.style.transform = `translateX(-${effectiveIndex * textContainerWidth}px)`;

            sliderWrapper.offsetHeight; // 強制リフロー
            // トランジション復元
            sliderWrapper.style.transition = currentImageTransition;
            textSliderWrapper.style.transition = currentTextTransition;
        }
    }

    function calculateDimensions() {
      if (imageSlides.length > 1) {
        slideWidth = imageSlides[1].offsetWidth;
        containerWidth = container.offsetWidth;
        textContainerWidth = textSliderContainer.offsetWidth; // テキストコンテナ幅を取得

        // テキストエリアの幅設定は不要に (CSSで100%のため)
      }
    }

    // 画像スライドを中央に表示するための transformX を計算
    function getTargetTransformX(targetEffectiveIndex) {
        if (!imageSlides[targetEffectiveIndex] || !containerWidth || !slideWidth) {
            return 0;
        }
        const containerCenter = containerWidth / 2;
        const slideOffsetLeft = imageSlides[targetEffectiveIndex].offsetLeft;
        const slideCenter = slideOffsetLeft + slideWidth / 2;
        const transformX = containerCenter - slideCenter;
        return Math.round(transformX);
    }

    // updateTextContent 関数は削除

    function moveToSlide(targetOriginalIndex) {
        if (isTransitioning) return;
        isTransitioning = true;

        const targetEffectiveIndex = targetOriginalIndex + 1;
        const targetImageTransform = getTargetTransformX(targetEffectiveIndex);
        // ★★★ テキストの移動量も計算 ★★★
        const targetTextTransform = -(targetEffectiveIndex * textContainerWidth);

        // アニメーション開始
        const transitionStyle = 'transform 0.5s ease-in-out';
        sliderWrapper.style.transition = transitionStyle;
        textSliderWrapper.style.transition = transitionStyle; // テキストも

        sliderWrapper.style.transform = `translateX(${targetImageTransform}px)`;
        textSliderWrapper.style.transform = `translateX(${targetTextTransform}px)`; // テキストも移動
    }

    sliderWrapper.addEventListener('transitionend', () => {
        // 画像スライダーのアニメーション完了を基準にする
        if (!isTransitioning) return; // 既に処理済みなら何もしない
        isTransitioning = false;

        const originalSlidesCount = originalImageSources.length;

        // 現在の画像スライドの transform 値から中央に近いものを判定
        const matrix = new WebKitCSSMatrix(window.getComputedStyle(sliderWrapper).transform);
        const currentTranslateX = matrix.m41;
        let closestEffectiveIndex = -1;
        let minDistance = Infinity;
        const currentContainerCenter = containerWidth / 2;

        for (let i = 0; i < imageSlides.length; i++) {
            const slideOffsetLeft = imageSlides[i].offsetLeft;
            const slideCenter = slideOffsetLeft + slideWidth / 2;
            const finalSlideCenterPosition = slideCenter + currentTranslateX;
            const distance = Math.abs(finalSlideCenterPosition - currentContainerCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestEffectiveIndex = i;
            }
        }

        let finalOriginalIndex = closestEffectiveIndex - 1;

        // ループ処理：クローン上で停止した場合のジャンプ
        if (closestEffectiveIndex === 0) { // 先頭クローン
            finalOriginalIndex = originalSlidesCount - 1;
            const targetImageTransform = getTargetTransformX(finalOriginalIndex + 1);
            const targetTextTransform = -((finalOriginalIndex + 1) * textContainerWidth); // テキストもジャンプ

            sliderWrapper.style.transition = 'none';
            textSliderWrapper.style.transition = 'none'; // テキストも

            sliderWrapper.style.transform = `translateX(${targetImageTransform}px)`;
            textSliderWrapper.style.transform = `translateX(${targetTextTransform}px)`; // テキストも

            sliderWrapper.offsetHeight; // 強制リフロー

            // アニメーションを戻す（次の操作のため）
            const transitionStyle = 'transform 0.5s ease-in-out';
            sliderWrapper.style.transition = transitionStyle;
            textSliderWrapper.style.transition = transitionStyle;

        } else if (closestEffectiveIndex === imageSlides.length - 1) { // 末尾クローン
            finalOriginalIndex = 0;
            const targetImageTransform = getTargetTransformX(finalOriginalIndex + 1);
            const targetTextTransform = -((finalOriginalIndex + 1) * textContainerWidth); // テキストもジャンプ

            sliderWrapper.style.transition = 'none';
            textSliderWrapper.style.transition = 'none';

            sliderWrapper.style.transform = `translateX(${targetImageTransform}px)`;
            textSliderWrapper.style.transform = `translateX(${targetTextTransform}px)`;

            sliderWrapper.offsetHeight;

            const transitionStyle = 'transform 0.5s ease-in-out';
            sliderWrapper.style.transition = transitionStyle;
            textSliderWrapper.style.transition = transitionStyle;
        }

        // 最終的なインデックスを確定
        currentIndex = Math.max(0, Math.min(finalOriginalIndex, originalSlidesCount - 1));

        // updateTextContent は不要
    });

    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        moveToSlide(currentIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        moveToSlide(currentIndex - 1);
    });

    window.addEventListener('resize', () => {
        // リサイズ時も両方の位置を再計算・再設定
        sliderWrapper.style.transition = 'none';
        textSliderWrapper.style.transition = 'none';

        calculateDimensions();
        const effectiveIndex = currentIndex + 1;
        const targetImageTransform = getTargetTransformX(effectiveIndex);
        const targetTextTransform = -(effectiveIndex * textContainerWidth);

        sliderWrapper.style.transform = `translateX(${targetImageTransform}px)`;
        textSliderWrapper.style.transform = `translateX(${targetTextTransform}px)`;

        setTimeout(() => {
            const transitionStyle = 'transform 0.5s ease-in-out';
            sliderWrapper.style.transition = transitionStyle;
            textSliderWrapper.style.transition = transitionStyle;
        }, 50);
    });

    document.addEventListener('DOMContentLoaded', setupSlider);

}