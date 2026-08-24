export const parseProducts = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const products = [];

  // Find all cards linking to products
  const productLinks = doc.querySelectorAll('a[href^="/product/"]');
  productLinks.forEach(link => {
    const href = link.getAttribute('href');
    const id = href.split('/').pop();

    const card = link.querySelector('.w-64') || link.firstElementChild;
    if (!card) return;

    // Get background color of image frame
    const imageWrapper = card.querySelector('div[style*="background-color"]') || card.firstElementChild;
    let bgcolor = '#F4EDE4';
    if (imageWrapper) {
      const styleBg = imageWrapper.style.backgroundColor;
      if (styleBg) bgcolor = styleBg;
    }

    const imgEl = card.querySelector('img');
    const imageSrc = imgEl ? imgEl.getAttribute('src') : '';

    // Get text details
    const nameEl = card.querySelector('h3');
    const priceEl = card.querySelector('h4');
    const name = nameEl ? nameEl.textContent.trim() : 'Luxury Apparel';
    const priceText = priceEl ? priceEl.textContent.trim() : '0';
    const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

    // Panel details
    const footer = card.querySelector('div.flex.justify-between.items-center') || card.lastElementChild;
    let panelcolor = '#FFFFFF';
    let textcolor = '#000000';
    if (footer) {
      panelcolor = footer.style.backgroundColor || '#FFFFFF';
      textcolor = footer.style.color || '#000000';
    }

    if (!products.some(p => p._id === id)) {
      products.push({
        _id: id,
        name,
        price,
        Image: imageSrc,
        bgcolor,
        panelcolor,
        textcolor,
        inStock: true,
      });
    }
  });

  return products;
};

export const parseProductDetails = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const nameEl = doc.querySelector('h1.text-4xl') || doc.querySelector('h1');
  const name = nameEl ? nameEl.textContent.trim() : 'Premium Apparel';

  const priceEl = doc.querySelector('h2.text-4xl') || doc.querySelector('h2') || doc.querySelector('.text-\\[\\#5A0000\\]');
  const priceText = priceEl ? priceEl.textContent.trim() : '0';
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

  const imgEl = doc.querySelector('img[src^="data:image/"]') || doc.querySelector('img');
  const imageSrc = imgEl ? imgEl.getAttribute('src') : '';

  // Get reviews
  const reviews = [];
  const reviewCards = doc.querySelectorAll('.border-b.pb-4') || [];
  reviewCards.forEach(card => {
    const userEl = card.querySelector('h3.font-bold') || card.querySelector('h3');
    const username = userEl ? userEl.textContent.trim() : 'Verified Buyer';

    const ratingEl = card.querySelector('.text-yellow-500');
    let rating = 5;
    if (ratingEl) {
      const match = ratingEl.textContent.match(/(\d+)/);
      if (match) rating = parseInt(match[1]);
    }

    const commentEl = card.querySelector('.text-gray-700') || card.querySelector('p:not(.text-yellow-500)');
    const comment = commentEl ? commentEl.textContent.trim() : '';

    const dateEl = card.querySelector('.text-sm.text-gray-400') || card.querySelector('p.text-sm');
    const date = dateEl ? dateEl.textContent.trim() : new Date().toDateString();

    reviews.push({
      _id: Math.random().toString(36).substr(2, 9),
      user: { fullname: username },
      rating,
      comment,
      createdAt: date
    });
  });

  return {
    name,
    price,
    Image: imageSrc,
    reviews,
    bgcolor: '#F4EDE4',
    description: "Premium quality apparel crafted with comfort, durability and modern style in mind. Designed for everyday wear and perfect for all seasons."
  };
};

export const parseCart = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const cartItems = [];

  // Cart item containers
  const items = doc.querySelectorAll('.bg-white.rounded-lg.shadow-md.p-5') || [];
  items.forEach(item => {
    const imgEl = item.querySelector('img');
    const imageSrc = imgEl ? imgEl.getAttribute('src') : '';

    const nameEl = item.querySelector('h2.text-2xl') || item.querySelector('h2');
    const name = nameEl ? nameEl.textContent.trim() : 'Premium Piece';

    const priceEl = item.querySelector('h3.text-lg') || item.querySelector('h3');
    const priceText = priceEl ? priceEl.textContent.trim() : '0';
    const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

    const discountEl = item.querySelector('.text-green-600');
    let discount = 0;
    if (discountEl) {
      const match = discountEl.textContent.match(/(\d+)/);
      if (match) discount = parseFloat(match[1]);
    }

    const qtySpan = item.querySelector('span.font-semibold.text-lg') || item.querySelector('.text-lg');
    const quantity = qtySpan ? parseInt(qtySpan.textContent.trim()) : 1;

    // Find product id from links: /cart/increase/:id or /cart/decrease/:id or /addtocart/:id
    const links = item.querySelectorAll('a[href*="/cart/"]');
    let id = '';
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const parts = href.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length > 10) { // check if valid ObjectId length
          id = lastPart;
        }
      }
    });

    if (id) {
      cartItems.push({
        product: {
          _id: id,
          name,
          price,
          Image: imageSrc,
          discount
        },
        quantity
      });
    }
  });

  // Extract totals
  let bill = 0;
  doc.querySelectorAll('div.flex.justify-between').forEach(div => {
    const spans = div.querySelectorAll('span');
    if (spans.length === 2 && (spans[0].textContent.includes('Total Amount') || spans[0].textContent.includes('Price'))) {
      bill = parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) || 0;
    }
  });

  return { cartItems, bill };
};

export const parseProfile = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  let fullname = '';
  let email = '';
  let contact = '';
  let cartLength = 0;
  let ordersLength = 0;
  let isadmin = false;

  const cards = doc.querySelectorAll('div.grid > div') || [];
  cards.forEach(card => {
    const label = card.querySelector('label');
    const valueDiv = card.querySelector('div');
    if (label && valueDiv) {
      const labelText = label.textContent.toLowerCase();
      const val = valueDiv.textContent.trim();

      if (labelText.includes('full name') || labelText.includes('fullname')) {
        fullname = val;
      } else if (labelText.includes('email')) {
        email = val;
      } else if (labelText.includes('contact')) {
        contact = val;
      } else if (labelText.includes('cart')) {
        cartLength = parseInt(val) || 0;
      } else if (labelText.includes('orders')) {
        ordersLength = parseInt(val) || 0;
      } else if (labelText.includes('type')) {
        isadmin = val.toLowerCase().includes('admin');
      }
    }
  });

  return {
    fullname: fullname || 'Scatch User',
    email: email || '',
    contact: contact || '9770454585',
    cartLength,
    ordersLength,
    isadmin
  };
};
