import { cart, removeFromCart, calculateCartQuantity, updateCartQuantity, updateDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { calculateDeliveryDate, deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {  
  let cartSummaryHTML = ''

  renderCheckoutHeader();

  cart.forEach((cartItem) => {
    const {productId} = cartItem;
    
    const matchingProduct = getProduct(productId)
    matchingProduct.quantity = cartItem.quantity;

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);


    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date js-delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
          src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${matchingProduct.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
                </span>
                <input class="quantity-input js-quantity-input-${matchingProduct.id}"></input>
                <span class="save-quantity link-primary js-save-quantity" data-product-id="${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div> 
    ` ;  
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    let deliveryyDayChecked;

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      deliveryyDayChecked = (deliveryOption.id === cartItem.deliveryOptionId) 
      ? "checked" 
      : "";
      
      const priceString = deliveryOption.priceCents === 0 
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      html += `
            <div class="delivery-option js-delivery-option"
              data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}">
              <input type="radio" ${deliveryyDayChecked}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString} Shipping
                </div>
              </div>
            </div>
            `
            
    });
    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const {productId} = link.dataset;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        container.remove();

        showCartQuantity();
        renderOrderSummary();
        renderPaymentSummary();
        
      })
    });

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const {productId} = link.dataset;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        
        container.classList.toggle('is-editing-quantity');

        document.querySelector(`.js-quantity-input-${productId}`)
          .addEventListener('keydown', (inputEvent) =>{
            if (inputEvent.key === 'Enter') {
              executeSave(productId);
            }
        });
      });
    });

  saveQuantity();

  function saveQuantity() {
    document.querySelectorAll('.js-save-quantity')
      .forEach((link)=> {
        link.addEventListener('click', () =>{
          executeSave(link.dataset.productId);
        });
      });
  }

  function executeSave(productId) {
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.toggle('is-editing-quantity');
    
    const quantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

    if (quantity < 0 || quantity > 999) {
      alert('The quantity must be between 0 and 1000');
      return
    }

    updateCartQuantity(productId, quantity);
    renderOrderSummary();
    renderPaymentSummary();
    
    document.querySelector(`.js-quantity-label-${productId}`)
      .innerHTML = quantity;
  }

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}