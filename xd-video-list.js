class XDVideoList {
  constructor(container) {
    this.container = container;
    this.wrapper = container.querySelector('.xd-video-list-wrapper');
    this.slideSpeed = parseInt(container.dataset.slideSpeed) * 1000;
    this.videoSpacing = parseInt(container.dataset.videoSpacing) || 20;
    this.hideControls = container.dataset.hideControls === 'true';
    this.scrollLeftButton = container.querySelector('.xd-scroll-left');
    this.scrollRightButton = container.querySelector('.xd-scroll-right');
    this.videosPerRowLandscape = parseInt(container.dataset.videosPerRowLandscape) || 4;
    this.videosPerRowPortrait = parseInt(container.dataset.videosPerRowPortrait) || 2;
    this.videoRatio = container.dataset.videoRatio || '16:9';
    this.progressColor = container.dataset.progressColor || '#ffffff';
    this.borderRadius = parseInt(container.dataset.borderRadius) || 8;
    
    this.init();
  }

  init() {
    // 设置视频间距和每行视频数量
    this.container.style.setProperty('--video-spacing', `${this.videoSpacing}px`);
    this.container.style.setProperty('--progress-color', this.progressColor);
    this.container.style.setProperty('--border-radius', `${this.borderRadius}px`);
    this.setVideoRatio();
    this.updateVideosPerRow();

    // 添加触摸滑动支持
    this.setupTouchEvents();

    // 初始化视频控制
    this.setupVideoControls();

    // 初始化滚动按钮
    this.setupScrollButtons();

    // 监听滚动事件以更新按钮状态
    this.wrapper.addEventListener('scroll', () => this.updateScrollButtons());

    // 监听窗口大小变化
    window.addEventListener('resize', () => this.handleResize());
    
    // 初始处理屏幕方向
    this.handleResize();
  }

  setVideoRatio() {
    let ratio;
    switch(this.videoRatio) {
      case '4:3':
        ratio = '75%';
        break;
      case '1:1':
        ratio = '100%';
        break;
      case '9:16':
        ratio = '177.78%';
        break;
      case '16:9':
      default:
        ratio = '56.25%';
    }
    this.container.style.setProperty('--video-ratio', ratio);
  }

  updateVideosPerRow() {
    this.wrapper.style.setProperty('--videos-per-row-landscape', this.videosPerRowLandscape);
    this.wrapper.style.setProperty('--videos-per-row-portrait', this.videosPerRowPortrait);
    this.handleResize();
  }

  handleResize() {
    // 检测屏幕方向
    const isPortrait = window.innerHeight > window.innerWidth;
    
    // 更新视频数量
    if (isPortrait) {
      this.wrapper.style.setProperty('--videos-per-row', this.videosPerRowPortrait);
    } else {
      this.wrapper.style.setProperty('--videos-per-row', this.videosPerRowLandscape);
    }
    
    // 更新按钮状态
    this.updateScrollButtons();
  }

  setupScrollButtons() {
    if (this.scrollLeftButton && this.scrollRightButton) {
      this.scrollLeftButton.addEventListener('click', () => {
        this.scroll('left');
      });

      this.scrollRightButton.addEventListener('click', () => {
        this.scroll('right');
      });

      // 初始更新按钮状态
      this.updateScrollButtons();
    }
  }

  scroll(direction) {
    const scrollAmount = this.wrapper.clientWidth * 0.8; // 滚动80%的容器宽度
    const currentScroll = this.wrapper.scrollLeft;
    const targetScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(this.wrapper.scrollWidth - this.wrapper.clientWidth, currentScroll + scrollAmount);

    this.wrapper.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }

  updateScrollButtons() {
    if (this.scrollLeftButton && this.scrollRightButton) {
      const isAtStart = this.wrapper.scrollLeft <= 0;
      const isAtEnd = this.wrapper.scrollLeft >= this.wrapper.scrollWidth - this.wrapper.clientWidth - 1;

      this.scrollLeftButton.style.opacity = isAtStart ? '0' : '1';
      this.scrollLeftButton.style.visibility = isAtStart ? 'hidden' : 'visible';
      this.scrollRightButton.style.opacity = isAtEnd ? '0' : '1';
      this.scrollRightButton.style.visibility = isAtEnd ? 'hidden' : 'visible';
    }
  }

  setupVideoControls() {
    const videoItems = this.container.querySelectorAll('.xd-video-item');
    
    videoItems.forEach(item => {
      const video = item.querySelector('video');
      const iframe = item.querySelector('iframe');
      const muteButton = item.querySelector('.xd-mute-button');
      const progressBar = item.querySelector('.xd-progress-bar');
      const progressContainer = item.querySelector('.xd-video-progress');
      const autoplay = item.dataset.autoplay === 'true';
      
      if (video) {
        // 鼠标悬停自动播放（仅当未设置自动播放时）
        if (!autoplay) {
          item.addEventListener('mouseenter', () => {
            video.play();
          });
          
          item.addEventListener('mouseleave', () => {
            video.pause();
          });
        }

        // 更新进度条
        const updateProgress = () => {
          if (progressBar && video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.style.display = 'block';
          }
        };

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('play', updateProgress);
        video.addEventListener('pause', updateProgress);
        video.addEventListener('ended', () => {
          if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.display = 'block';
          }
        });

        // 进度条交互
        if (progressContainer && progressBar) {
          let isDragging = false;

          const seekTo = (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            const newTime = pos * video.duration;
            video.currentTime = newTime;
            updateProgress();
          };

          progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            seekTo(e);
          });

          document.addEventListener('mousemove', (e) => {
            if (isDragging) {
              seekTo(e);
            }
          });

          document.addEventListener('mouseup', () => {
            isDragging = false;
          });

          progressContainer.addEventListener('click', (e) => {
            if (!isDragging) {
              seekTo(e);
            }
          });
        }

        // 静音按钮控制
        if (muteButton) {
          muteButton.addEventListener('click', () => {
            video.muted = !video.muted;
            this.updateMuteButton(muteButton, video.muted);
          });
        }
      }

      if (iframe) {
        // 为 iframe 添加静音控制
        if (muteButton) {
          muteButton.addEventListener('click', () => {
            const isMuted = iframe.src.includes('mute=1');
            const newSrc = isMuted ? 
              iframe.src.replace('mute=1', 'mute=0') : 
              iframe.src.replace('mute=0', 'mute=1');
            iframe.src = newSrc;
            this.updateMuteButton(muteButton, !isMuted);
          });
        }

        // 为 iframe 添加进度条更新
        if (progressBar) {
          // 使用 postMessage 监听 iframe 进度更新
          window.addEventListener('message', (event) => {
            if (event.source === iframe.contentWindow) {
              const data = event.data;
              if (data.type === 'progress' && data.progress) {
                progressBar.style.width = `${data.progress * 100}%`;
                progressBar.style.display = 'block';
              }
            }
          });

          // 为 YouTube 和 Vimeo 添加特定的进度更新
          if (iframe.src.includes('youtube.com')) {
            iframe.src += '&enablejsapi=1';
          } else if (iframe.src.includes('vimeo.com')) {
            iframe.src += '&api=1';
          }
        }
      }
    });
  }

  updateMuteButton(button, isMuted) {
    const muteIcon = button.querySelector('.mute-icon');
    const unmuteIcon = button.querySelector('.unmute-icon');
    
    if (isMuted) {
      muteIcon.style.display = 'block';
      unmuteIcon.style.display = 'none';
    } else {
      muteIcon.style.display = 'none';
      unmuteIcon.style.display = 'block';
    }
  }

  setupTouchEvents() {
    let startX;
    let scrollLeft;

    this.wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - this.wrapper.offsetLeft;
      scrollLeft = this.wrapper.scrollLeft;
    });

    this.wrapper.addEventListener('touchmove', (e) => {
      if (!startX) return;
      
      const x = e.touches[0].pageX - this.wrapper.offsetLeft;
      const walk = (x - startX) * 2;
      this.wrapper.scrollLeft = scrollLeft - walk;
    });

    this.wrapper.addEventListener('touchend', () => {
      startX = null;
    });
  }
}

// 初始化所有视频列表
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.xd-video-list-container').forEach(container => {
    new XDVideoList(container);
  });
});

// 监听主题编辑器变化
if (window.Shopify && window.Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const container = event.target.querySelector('.xd-video-list-container');
    if (container) {
      new XDVideoList(container);
    }
  });

  document.addEventListener('shopify:section:unload', (event) => {
    const container = event.target.querySelector('.xd-video-list-container');
    if (container) {
      // 清理事件监听器
      const wrapper = container.querySelector('.xd-video-list-wrapper');
      if (wrapper) {
        wrapper.removeEventListener('scroll', () => {});
      }
      window.removeEventListener('resize', () => {});
    }
  });
} 