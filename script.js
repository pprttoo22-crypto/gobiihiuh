(() => {
  "use strict";

  const products = {
    golden: {
      name: "Golden Oud",
      category: "Східний · деревний",
      price: 3850,
      notes: "Шафран · троянда · уд · амбра",
      description:
        "Теплий, глибокий аромат із м’яким деревним шлейфом. Демонстраційний опис для навчального макета.",
      image:
        "https://images.unsplash.com/photo-1627823569857-4d8581dc62b2?auto=format&fit=crop&w=300&q=75"
    },
    rose: {
      name: "Midnight Rose",
      category: "Квітковий · пудровий",
      price: 3420,
      notes: "Троянда · півонія · ірис · мускус",
      description:
        "Витончена квіткова композиція з пудровим настроєм і спокійним вечірнім характером.",
      image:
        "https://images.unsplash.com/photo-1774682060922-c395859148c9?auto=format&fit=crop&w=300&q=75"
    },
    noir: {
      name: "Velvet Noir",
      category: "Шкіряний · пряний",
      price: 4100,
      notes: "Чорний перець · замша · пачулі · кедр",
      description:
        "Темний і виразний аромат із пряним початком та м’якою шкіряною нотою.",
      image:
        "https://images.unsplash.com/photo-1774682060959-efe13b7a12b9?auto=format&fit=crop&w=300&q=75"
    },
    amber: {
      name: "Amber Dreams",
      category: "Амбровий · гурманський",
      price: 3690,
      notes: "Мандарин · ваніль · бензоїн · амбра",
      description:
        "М’яке тепло ванілі й амбри створює затишний аромат із сонячним відтінком.",
      image:
        "https://images.unsplash.com/photo-1618606406819-8db8d03ac980?auto=format&fit=crop&w=300&q=75"
    },
    white: {
      name: "White Elegance",
      category: "Цитрусовий · чистий",
      price: 3250,
      notes: "Бергамот · неролі · білий чай · мускус",
      description:
        "Світла композиція з цитрусовою свіжістю та чистим, делікатним завершенням.",
      image:
        "https://images.unsplash.com/photo-1779285516366-7277d9830566?auto=format&fit=crop&w=300&q=75"
    },
    royal: {
      name: "Royal Essence",
      category: "Фужерний · деревний",
      price: 4450,
      notes: "Кардамон · лаванда · ветивер · дубовий мох",
      description:
        "Елегантна деревна композиція, у якій свіжі трави зустрічаються з теплим ветивером.",
      image:
        "https://images.unsplash.com/photo-1589782431423-61e3cd275318?auto=format&fit=crop&w=300&q=75"
    }
  };

  const money = (value) =>
    "₴ " + new Intl.NumberFormat("uk-UA").format(value);

  const root = document.documentElement;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function setMotionPreference() {
    root.classList.toggle("motion-enabled", !reduceMotion.matches);
    root.classList.toggle("reduced-motion", reduceMotion.matches);

    if (reduceMotion.matches) {
      document.querySelectorAll(".reveal").forEach((element) => {
        element.classList.add("is-visible");
      });
    }
  }

  setMotionPreference();
  reduceMotion.addEventListener?.("change", setMotionPreference);

  // Якщо фото не завантажилося, показуємо CSS-фолбек.
  document.querySelectorAll(".image-fallback-target").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.classList.add("image-failed");

        if (image.classList.contains("hero-photo")) {
          image
            .closest(".hero-photo-wrap")
            ?.classList.add("image-failed");
        }
      },
      { once: true }
    );
  });

  // Плавно показуємо секції під час прокручування.
  const revealItems = [...document.querySelectorAll(".reveal")];

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Змінюємо вигляд навігації після прокручування сторінки.
  const nav = document.getElementById("siteNav");

  function updateNavigation() {
    nav?.classList.toggle("is-scrolled", window.scrollY > 28);
  }

  updateNavigation();
  window.addEventListener("scroll", updateNavigation, { passive: true });

  // Закриваємо мобільне меню після натискання на посилання.
  const navCollapse = document.getElementById("mainNav");

  navCollapse?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (
        window.bootstrap &&
        navCollapse.classList.contains("show")
      ) {
        window.bootstrap.Collapse
          .getOrCreateInstance(navCollapse)
          .hide();
      }
    });
  });

  // Пошук ароматів.
  const searchPanel = document.getElementById("searchPanel");
  const searchInput = document.getElementById("searchInput");
  const searchStatus = document.getElementById("searchStatus");
  const searchToggle = document.getElementById("searchToggle");
  const productCards = [
    ...document.querySelectorAll("[data-product-card]")
  ];

  function filterProducts(query) {
    const value = query.trim().toLocaleLowerCase("uk");
    let visibleCount = 0;

    productCards.forEach((card) => {
      const matches = !value || card.dataset.search.includes(value);

      card.classList.toggle("d-none", !matches);

      if (matches) {
        visibleCount++;
      }
    });

    if (value && visibleCount === 0) {
      searchStatus.textContent =
        "За цим запитом ароматів не знайдено.";
    } else if (value) {
      searchStatus.textContent =
        "Знайдено ароматів: " + visibleCount;
    } else {
      searchStatus.textContent = "";
    }
  }

  function closeSearch() {
    searchPanel.classList.remove("is-open");
    searchToggle?.setAttribute("aria-expanded", "false");
    searchInput.value = "";
    filterProducts("");
  }

  searchToggle?.addEventListener("click", () => {
    const isOpen = !searchPanel.classList.contains("is-open");

    searchPanel.classList.toggle("is-open", isOpen);
    searchToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      searchInput.focus();
    } else {
      closeSearch();
    }
  });

  document
    .getElementById("searchClose")
    ?.addEventListener("click", closeSearch);

  searchInput?.addEventListener("input", () => {
    filterProducts(searchInput.value);
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
    }

    if (event.key === "Enter") {
      document.getElementById("collection").scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });
    }
  });

  // Демонстраційний кошик.
  const cart = new Map();

  const cartCount = document.getElementById("cartCount");
  const drawerCount = document.getElementById("drawerCount");
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartSummary = document.getElementById("cartSummary");
  const cartTotal = document.getElementById("cartTotal");
  const toastElement = document.getElementById("cartToast");
  const toastText = document.getElementById("toastText");

  const toast =
    window.bootstrap && toastElement
      ? new bootstrap.Toast(toastElement, { delay: 2400 })
      : null;

  function renderCart() {
    const totalItems = [...cart.values()].reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalPrice = [...cart.entries()].reduce(
      (sum, [id, item]) =>
        sum + item.quantity * products[id].price,
      0
    );

    cartCount.textContent = String(totalItems);
    drawerCount.textContent = "(" + totalItems + ")";
    cartTotal.textContent = money(totalPrice);

    cartEmpty.classList.toggle("d-none", totalItems > 0);
    cartSummary.classList.toggle("is-visible", totalItems > 0);

    cartItems.innerHTML = [...cart.entries()]
      .map(([id, item]) => {
        const product = products[id];

        return `
          <div class="cart-row" data-cart-row="${id}">
            <img
              class="cart-thumb"
              src="${product.image}"
              alt=""
              loading="lazy"
            >
            <div>
              <h3>${product.name}</h3>
              <p>${product.category}</p>
              <div class="cart-quantity">
                <button
                  class="quantity-button"
                  type="button"
                  data-quantity="${id}"
                  data-change="-1"
                  aria-label="Зменшити кількість"
                >−</button>
                <span>${item.quantity}</span>
                <button
                  class="quantity-button"
                  type="button"
                  data-quantity="${id}"
                  data-change="1"
                  aria-label="Збільшити кількість"
                >+</button>
                <button
                  class="remove-item"
                  type="button"
                  data-remove="${id}"
                >Видалити</button>
              </div>
            </div>
            <strong class="cart-row-price">
              ${money(product.price * item.quantity)}
            </strong>
          </div>
        `;
      })
      .join("");

    cartItems.querySelectorAll(".cart-thumb").forEach((image) => {
      image.addEventListener(
        "error",
        () => image.classList.add("image-failed"),
        { once: true }
      );
    });
  }

  function addToCart(id) {
    if (!products[id]) {
      return;
    }

    const item = cart.get(id) || { id, quantity: 0 };
    item.quantity++;
    cart.set(id, item);

    renderCart();

    toastText.textContent = products[id].name + " додано до кошика";
    toast?.show();
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
      addToCart(addButton.dataset.add);
    }

    const quantityButton = event.target.closest("[data-quantity]");

    if (quantityButton) {
      const id = quantityButton.dataset.quantity;
      const item = cart.get(id);

      if (item) {
        item.quantity += Number(quantityButton.dataset.change);

        if (item.quantity <= 0) {
          cart.delete(id);
        }

        renderCart();
      }
    }

    const removeButton = event.target.closest("[data-remove]");

    if (removeButton) {
      cart.delete(removeButton.dataset.remove);
      renderCart();
    }
  });

  renderCart();

  // Вікно з описом аромату.
  const modalElement = document.getElementById("productModal");
  const productModal = window.bootstrap
    ? new bootstrap.Modal(modalElement)
    : null;

  let selectedProduct = "";

  document.querySelectorAll("[data-details]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedProduct = button.dataset.details;
      const product = products[selectedProduct];

      if (!product) {
        return;
      }

      document.getElementById("productModalTitle").textContent =
        product.name;

      document.getElementById("productModalCopy").textContent =
        product.description;

      document.getElementById("productNotes").textContent =
        product.notes;

      document.getElementById("productModalPrice").textContent =
        money(product.price) + " · 50 мл";

      productModal?.show();
    });
  });

  document
    .getElementById("modalAddButton")
    ?.addEventListener("click", () => {
      if (!selectedProduct) {
        return;
      }

      addToCart(selectedProduct);
      productModal?.hide();
    });

  document
    .getElementById("checkoutButton")
    ?.addEventListener("click", () => {
      toastText.textContent =
        "Це демонстраційний кошик: оформлення та оплата не підключені.";
      toast?.show();
    });

  // Перевірка контактної форми.
  const form = document.getElementById("contactForm");
  const contactField = document.getElementById("contactAddress");

  function isValidContact(value) {
    const text = value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    const isPhone = /^\+?[\d\s().-]{7,}$/.test(text);

    return isEmail || isPhone;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    contactField.setCustomValidity(
      isValidContact(contactField.value)
        ? ""
        : "Введіть email або телефон."
    );

    const fields = [...form.querySelectorAll(".form-control")];
    
    const btnaadd=document.querySelector(".button-add")
    btnaadd.addEventListener('click', () => {
    gtag('event', 'order_button_clicked');
    console.log('Дані відправлено!');
});

    fields.forEach((field) => {
      field.classList.toggle("is-invalid", !field.checkValidity());

      field.addEventListener(
        "input",
        () => field.classList.remove("is-invalid"),
        { once: true }
      );
    });

    if (!form.checkValidity()) {
      form.querySelector(":invalid")?.focus();
      return;
    }

    const result = document.getElementById("formResult");
    const visitorName = form.elements.name.value.trim();

    result.textContent =
      `Дякуємо, ${visitorName}. Поля перевірені, але повідомлення ` +
      "не відправлено: до форми потрібно підключити сервер або сервіс обробки заявок.";

    result.classList.add("is-visible");
    form.reset();
  });
})();
