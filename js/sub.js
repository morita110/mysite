document.addEventListener('DOMContentLoaded', () => {
  const imageTrack = document.querySelector('.image-track');
  const textTrack = document.querySelector('.text-track');
  const prevButton = document.querySelector('.prev-btn');
  const nextButton = document.querySelector('.next-btn');
  const imageViewer = document.querySelector('.image-viewer');
  const textViewer = document.querySelector('.text-viewer');

  const slideData = [
    { src: "img/mint.png", alt: "Image 1: Landscape", title: "2015年", subtitle: "milk shopオープン", description: "毎日でもお子様に食べさせられる安全性。北海道は十勝の厳選した牛乳だけを使い、生クリームのよなアイスを目指し、2年以上の歳月をかけてようやく誕生しました。" },
    { src: "img/mint.png", alt: "Image 2: River", title: "2017年", subtitle: "リニューアルに向けて", description: "お客様がお子様だけでなく幅広い年齢層に楽しまれるようになったことから、大人にもアイスのセレクトの幅を持たせました。" },
    { src: "img/mint.png", alt: "Image 3: Forest", title: "2020年", subtitle: "Premium milk発売", description: "『究極の卵』と『至高の牛乳』とのフュージョンが楽しめるというコンセプトの「Premium milk」シリーズ発売。" },
    { src: "img/mint.png", alt: "Image 4: City", title: "2024年", subtitle: "飽くなき探求", description: "milk shopの特長であるミルク感をさらに深め、食べ飽きないコクとデリシャス感も目指してリニューアル。" },
  ];

  let currentSlideIndex = 0;
  let totalSlides = slideData.length;
  let imageItemWidth = 0; // Width of a single image item
  let imageSlideDistance = 0; // Distance to move the image track per slide
  let textSlideWidth = 0;
  let isAnimating = false;
  const imageGap = 10; // Define gap constant
  // --- Updated Peek Amount ---
  const peekAmount = 20; // How much the adjacent slides peek (Changed from 15)
  // --- End Update ---

  // --- Create Slides ---
  function createSlides() {
    slideData.forEach(data => {
      // Create image slide
      const imageItem = document.createElement('div');
      imageItem.classList.add('image-item');
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.alt;
      imageItem.appendChild(img);
      imageTrack.appendChild(imageItem);

      // Create text slide
      const textItem = document.createElement('div');
      textItem.classList.add('text-item');
      textItem.innerHTML = `
        <h3>${data.title || ''}</h3>
        <h4>${data.subtitle || ''}</h4>
        <p>${data.description || ''}</p>
      `;
      textTrack.appendChild(textItem);
    });
  }

  // --- Calculate Dimensions ---
  function calculateDimensions() {
    const viewerWidth = imageViewer.offsetWidth;
    // Calculate the width of a single image item (viewer width - both peeks)
    // Uses the updated peekAmount
    imageItemWidth = viewerWidth - (2 * peekAmount);

    // The distance to move the track is the width of an item plus the gap
    imageSlideDistance = imageItemWidth + imageGap;

    // Text slide width is simply the text viewer's width
    textSlideWidth = textViewer.offsetWidth;

    // Ensure correct initial position without animation
    moveToSlide(currentSlideIndex, false);
  }

  // --- Move To Slide ---
  function moveToSlide(index, animate = true) {
    if (index < 0 || index >= totalSlides || (isAnimating && animate)) {
      return;
    }

    if (animate) {
        isAnimating = true;
    }

    imageTrack.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    textTrack.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';

    // Calculate transform value for images to center the target slide
    // Formula: peekAmount - (index * distance_per_slide)
    // Uses the updated peekAmount
    const imageTransformValue = peekAmount - (index * imageSlideDistance);

    // Calculate transform value for text (standard full slide)
    const textTransformValue = -index * textSlideWidth;

    // Apply transform
    imageTrack.style.transform = `translateX(${imageTransformValue}px)`;
    textTrack.style.transform = `translateX(${textTransformValue}px)`;

    currentSlideIndex = index;
    updateButtonVisibility();

    if (animate) {
      const transitionEndHandler = () => {
        isAnimating = false;
        imageTrack.removeEventListener('transitionend', transitionEndHandler);
      };
      imageTrack.addEventListener('transitionend', transitionEndHandler);
    } else {
       isAnimating = false;
    }
  }


  // --- Update Button Visibility ---
  function updateButtonVisibility() {
    prevButton.classList.toggle('hidden', currentSlideIndex === 0);
    nextButton.classList.toggle('hidden', currentSlideIndex === totalSlides - 1);
  }

  // --- Event Listeners ---
  nextButton.addEventListener('click', () => {
    moveToSlide(currentSlideIndex + 1);
  });

  prevButton.addEventListener('click', () => {
    moveToSlide(currentSlideIndex - 1);
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
          calculateDimensions();
      }, 100);
  });

  // --- Initialization ---
  createSlides();
  requestAnimationFrame(() => {
      calculateDimensions();
      updateButtonVisibility();
  });
});
