/**
 * SimpleLightbox - Vanilla JS Lightbox
 * Custom implementation for Hugo kiimee-blog
 */
(function() {
  'use strict';

  class SimpleLightbox {
    constructor(options = {}) {
      this.options = {
        overlay: true,
        closeBtn: true,
        nav: true,
        loop: true,
        ...options
      };
      this.currentIndex = 0;
      this.items = [];
      this.isOpen = false;
      this.init();
    }

    init() {
      this.createElements();
      this.bindEvents();
    }

    createElements() {
      this.container = document.createElement('div');
      this.container.id = 'sl-overlay';
      this.container.className = 'sl-overlay';
      this.container.innerHTML = `
        <div class="sl-content">
          <div class="sl-image">
            <img src="" alt="">
            <div class="sl-caption"></div>
          </div>
          <button class="sl-close">&times;</button>
          <button class="sl-prev">&#10094;</button>
          <button class="sl-next">&#10095;</button>
          <div class="sl-counter"></div>
        </div>
      `;
      document.body.appendChild(this.container);

      this.elements = {
        overlay: this.container,
        image: this.container.querySelector('.sl-image img'),
        caption: this.container.querySelector('.sl-caption'),
        close: this.container.querySelector('.sl-close'),
        prev: this.container.querySelector('.sl-prev'),
        next: this.container.querySelector('.sl-next'),
        counter: this.container.querySelector('.sl-counter'),
        content: this.container.querySelector('.sl-content')
      };

      this.addStyles();
    }

    addStyles() {
      if (document.getElementById('sl-styles')) return;
      const style = document.createElement('style');
      style.id = 'sl-styles';
      style.textContent = `
        .sl-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.92);
          z-index: 9999;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .sl-overlay.active {
          display: flex;
          opacity: 1;
        }
        .sl-content {
          position: relative;
          max-width: 90%;
          max-height: 90%;
        }
        .sl-image {
          position: relative;
        }
        .sl-image img {
          max-width: 100%;
          max-height: 85vh;
          display: block;
          border: none;
        }
        .sl-caption {
          text-align: center;
          color: #fff;
          padding: 15px 10px 5px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .sl-close, .sl-prev, .sl-next {
          position: absolute;
          background: none;
          border: none;
          color: #fff;
          font-size: 28px;
          cursor: pointer;
          padding: 10px;
          transition: opacity 0.2s;
          opacity: 0.7;
        }
        .sl-close:hover, .sl-prev:hover, .sl-next:hover {
          opacity: 1;
        }
        .sl-close {
          top: 15px;
          right: 20px;
          font-size: 36px;
        }
        .sl-prev {
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
        .sl-next {
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
        .sl-counter {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .sl-image:only-child .sl-prev,
        .sl-image:only-child .sl-next {
          display: none;
        }
        .sl-overlay .sl-image img {
          cursor: default;
        }
        @media (max-width: 600px) {
          .sl-prev, .sl-next {
            font-size: 22px;
            padding: 8px;
          }
          .sl-close {
            font-size: 28px;
            top: 10px;
            right: 15px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    bindEvents() {
      this.elements.close.addEventListener('click', () => this.close());
      this.elements.prev.addEventListener('click', () => this.prev());
      this.elements.next.addEventListener('click', () => this.next());

      this.container.addEventListener('click', (e) => {
        if (e.target === this.container) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }

    open(selector = '[data-lightbox]') {
      this.items = [];
      document.querySelectorAll(selector).forEach((el, index) => {
        this.items.push({
          url: el.href,
          caption: el.dataset.title || el.querySelector('img')?.alt || '',
          element: el
        });
      });

      if (this.items.length === 0) return;

      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const index = this.items.findIndex(item => item.url === el.href);
          this.show(index);
        });
      });
    }

    show(index) {
      if (index < 0 || index >= this.items.length) return;
      if (!this.options.loop && (index < 0 || index >= this.items.length)) return;

      this.currentIndex = index;
      const item = this.items[this.currentIndex];

      this.elements.image.src = item.url;
      this.elements.image.alt = item.caption;
      this.elements.caption.textContent = item.caption;
      this.elements.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;

      this.elements.prev.style.display = this.options.loop || this.currentIndex > 0 ? 'block' : 'none';
      this.elements.next.style.display = this.options.loop || this.currentIndex < this.items.length - 1 ? 'block' : 'none';

      this.container.classList.add('active');
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.container.classList.remove('active');
      this.isOpen = false;
      document.body.style.overflow = '';
      this.elements.image.src = '';
    }

    prev() {
      if (this.currentIndex > 0 || this.options.loop) {
        this.show(this.currentIndex - 1);
      }
    }

    next() {
      if (this.currentIndex < this.items.length - 1 || this.options.loop) {
        this.show(this.currentIndex + 1);
      }
    }
  }

  window.SimpleLightbox = SimpleLightbox;

  document.addEventListener('DOMContentLoaded', () => {
    window.lightbox = new SimpleLightbox({
      closeBtn: true,
      nav: true,
      loop: true
    });
    window.lightbox.open('[data-lightbox]');
    console.log('SimpleLightbox initialized');
  });
})();
