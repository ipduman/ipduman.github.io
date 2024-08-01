const panel = document.getElementById("panel");
const products = document.querySelectorAll(".product");
const message = document.getElementById("message");

function checkIfCarIsCompleted() {
  for (const p of products) {
    if (!p.classList.contains("selected")) {
      panel.hidden = false;
      return;
    }
  }

  panel.hidden = true;
  message.hidden = false;
  clearCartButton.hidden = false;
}

function removeProductFromCart(productId) {
  Ecwid.Cart.get(function (cart) {
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].product.id === Number(productId)) {
        Ecwid.Cart.removeProduct(i);
        console.log("removed", productId);
        return;
      }
    }
  });
}

function onProductClick(event) {
  const pElement = event.target.closest(".product");

  if (!pElement) {
    return;
  }

  const ecwidProductId = pElement.getAttribute("data-ecwid-product-id");

  if (pElement.classList.contains("selected")) {
    pElement.classList.remove("selected");
    removeProductFromCart(ecwidProductId);
  } else {
    pElement.classList.add("selected");
    Ecwid.Cart.addProduct(ecwidProductId);
    console.log("added", ecwidProductId);
  }

  checkIfCarIsCompleted();
  // тут я могу уже писать логику на чекаут корзины
}

Ecwid.OnAPILoaded.add(function () {
  products.forEach((p) => p.addEventListener("click", onProductClick));

  Ecwid.Cart.get(function (cart) {
    console.log(cart);

    for (const item of cart.items) {
      const pElement = document.querySelector(
        `.product[data-ecwid-product-id="${item.product.id}"]`
      );

      if (pElement) {
        pElement.classList.add("selected");
      }
    }

    checkIfCarIsCompleted();
  });
});

function clearCartAndCheck() {
  Ecwid.Cart.clear();
  products.forEach((p) => p.classList.remove("selected"));
  checkIfCarIsCompleted();
  message.hidden = true;
  clearCartButton.hidden = true;
}
