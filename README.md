# digexmp1-a3-backend

## Curtin University - Academic Integrity Warning

> "Curtin recognises that students who are unfamiliar with the conventions of academic writing can sometimes unintentionally plagiarise or collude on assessments. This may happen if you inadequately acknowledge resources or collaborate with other students when an assessment should be done individually. An academic integrity warning is used to assign you an educative action in these situations so you can learn from your mistakes. More serious academic breaches such as cheating are managed as misconduct."
For more information, visit [Academic Integrity at Curtin](https://www.curtin.edu.au/students/essentials/rights/academic-integrity/)

## 1. Links

- [Live website](https://endearing-manatee-fc92e7.netlify.app)
- ~~[Backend API](https://anyamchelo-coffeeon-backend-b2n2v.ondigitalocean.app)~~

## 2. API documentation

### 2.1. Auth routes

#### 2.1.1. POST

```http request
/auth/login
```

- **Description:** Login request.
- **Access:** Public.
---

#### 2.1.2. GET

```http request
/auth/validate
```
- **Description:** Validate login.
- **Access:** Public.
---

### 2.2. Home routes

#### 2.2.1. GET

```http request
/
```
- **Description:** Populate database with pre-seeded data if empty.
- **Access:** Public.
---

### 2.3. User routes

#### 2.3.1. GET

```http request
/user
```
- **Description:** Get all users.
- **Access:** Private.
---

#### 2.3.2. GET

```http request
/user/:id
```
- **Description:** Get a user by id.
- **Access:** Private.
---

#### 2.3.3. GET

```http request
/user/access/:accessLevel
```
- **Description:** Get a user by access level.
- **Access:** Private.
---

#### 2.3.4. POST

```http request
/user
```
- **Description:** Create a new user account.
- **Access:** Public.
---

#### 2.3.5. PUT

```http request
/user/:id
```
- **Description:** Update a user account by id.
- **Access:** Private.
---

#### 2.3.6. PUT

```http request
/user/add/favouriteBarista
```
- **Description:** Add a user to favourite baristas array.
- **Access:** Private.
---

#### 2.3.7. PUT

```http request
/user/remove/favouriteBarista
```
- **Description:** Remove a user from favourite baristas array.
- **Access:** Private.
---

#### 2.3.8. PUT

```http request
/user/add/favouriteDrink
```
- **Description:** Add a drink to favourite drinks array.
- **Access:** Private.
---

#### 2.3.9. PUT

```http request
/user/remove/favouriteDrink
```
- **Description:** Remove a drink from favourite drinks array.
- **Access:** Private.
---

#### 2.3.10. PUT

```http request
/user/add/cart
```
- **Description:** Add a drink to cart array.
- **Access:** Private.
---

#### 2.3.11. PUT

```http request
/user/remove/cart
```
- **Description:** Remove a drink from cart array.
- **Access:** Private.
---

#### 2.3.12. PUT

```http request
/user/removeAll/cart
```
- **Description:** Remove all drinks from cart array.
- **Access:** Private.
---

#### 2.3.13. DELETE

```http request
/user/:id
```
- **Description:** Delete a user by id.
- **Access:** Private.
---

### 2.4. Drink routes

#### 2.4.1. GET

```http request
/drink
```
- **Description:** Get all drinks.
- **Access:** Private.
---

#### 2.4.2. GET

```http request
/drink/count/:userId
```
- **Description:** Get drink count by user id.
- **Access:** Private.
---

#### 2.4.3. GET

```http request
/drink/special
```
- **Description:** Get all special drinks.
- **Access:** Private.
---

#### 2.4.4. GET

```http request
/drink/:id
```
- **Description:** Get a drink by id.
- **Access:** Private.
---

#### 2.4.5. GET

```http request
/drink/by/:userId
```
- **Description:** Get drinks by user id.
- **Access:** Private.
---

#### 2.4.6. POST

```http request
/drink
```
- **Description:** Create a new drink.
- **Access:** Private.
---

#### 2.4.7. PUT

```http request
/drink/:id
```
- **Description:** Update a drink by id.
- **Access:** Private.
---

#### 2.4.8. DELETE

```http request
/drink/:id
```
- **Description:** Delete a drink by id.
- **Access:** Private.
---

### 2.5. Order routes

#### 2.5.1. GET

```http request
/order/last/:id
```
- **Description:** Get last order by customer id.
- **Access:** Private.
---

#### 2.5.2. GET

```http request
/order/myLast/:id
```
- **Description:** Get last order by barista id.
- **Access:** Private.
---

#### 2.5.3. GET

```http request
/order/customer/:id
```
- **Description:** Get orders by customer id.
- **Access:** Private.
---

#### 2.5.4. GET

```http request
/order/barista/:id
```
- **Description:** Get orders by barista id.
- **Access:** Private.
---

#### 2.5.5. GET

```http request
/order/count/:userId
```
- **Description:** Get order count by user id.
- **Access:** Private.
---

#### 2.5.6. POST

```http request
/order
```
- **Description:** Create a new order.
- **Access:** Private.
---

#### 2.5.7. PUT

```http request
/order/status
```
- **Description:** Update ready status by order id.
- **Access:** Private.
---

## 3. References 

“Array.prototype.filter().” 2019. MDN Web Docs. November 6, 2019. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter.

“Mongoose V8.0.0: Middleware.” n.d. Mongoosejs.com. Accessed November 13, 2023. https://mongoosejs.com/docs/middleware.html.

“Mongoose V8.0.0: Query.” n.d. Mongoosejs.com. Accessed November 13, 2023. https://mongoosejs.com/docs/api/query.html#Query.prototype.getQuery().

“30 Different Types of Coffee Drinks Explained.” n.d. Www.gridlockcoffee.com.au. https://www.gridlockcoffee.com.au/blog/30-different-types-of-coffee-drinks-explained/.

## 4. Images

“Affogato Isolated Transparent Background. Generative AI Stock Photo.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/affogato-isolated-transparent-background-generative-ai/630476373?prev_url=detail&asset_id=630476373.

“Coffee Americano in a Transparent Glass Mug Isolated. Classic Coffee Beverage. Transparent PNG Image. Stock Photo.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/coffee-americano-in-a-transparent-glass-mug-isolated-classic-coffee-beverage-transparent-png-image/609759430?prev_url=detail&asset_id=609759430.

“Continue Line of Barista Making Coffee. Line Art Drawing of Staff Coffee Illustration. Minimalist Stock Illustration.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/continue-line-of-barista-making-coffee-line-art-drawing-of-staff-coffee-illustration-minimalist/616620733?prev_url=detail&asset_id=616620733.

“Cortado Coffee, Cafe Style, Isolated Transparent Background. Generative AI Stock Photo.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/cortado-coffee-cafe-style-isolated-transparent-background-generative-ai/630475985?prev_url=detail&asset_id=630475985.

“Iced Coffee Cups Isolated on Transparent Background, Top Side View, View from Above, Delicious Iced Latte Coffee Drink in Glasses with Ice Cubes, Straw, Cold Beverage, Generative Ai Stock Illustration.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/iced-coffee-cups-isolated-on-transparent-background-top-side-view-view-from-above-delicious-iced-latte-coffee-drink-in-glasses-with-ice-cubes-straw-cold-beverage-generative-ai/621987234?prev_url=detail&asset_id=621987234.

“Isolated Glass Cup with Viennese Coffee with Cream on a Cutout PNG Transparent Background. Generative AI Stock Illustration.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/isolated-glass-cup-with-viennese-coffee-with-cream-on-a-cutout-png-transparent-background-generative-ai/614852467?prev_url=detail&asset_id=614852467.

“Multiple Glasses of Different Types of Colorful Coffee Isolated on Transparent Background PNG. Stock Photo.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/multiple-glasses-of-different-types-of-colorful-coffee-isolated-on-transparent-background-png/664512075?prev_url=detail&asset_id=664512075.

“Set with Cups of Hot Aromatic Espresso Coffee on Transparent Background. Banner Design Stock Illustration.” n.d. Adobe Stock. Accessed November 13, 2023. https://stock.adobe.com/au/images/set-with-cups-of-hot-aromatic-espresso-coffee-on-transparent-background-banner-design/614722086?prev_url=detail&asset_id=614722086.

Unsplash. 2015. “Photo by Brooke Cagle on Unsplash.” Unsplash.com. December 16, 2015. https://unsplash.com/photos/woman-smiling-while-standing-in-garden-HRZUzoX1e6w.

Unsplash. 2017. “Photo by Erik Lucatero on Unsplash.” Unsplash.com. July 14, 2017. https://unsplash.com/photos/man-wearing-black-crew-neck-shirt-d2MSDujJl2g.

Unsplash. 2017. “Photo by Michael Dam on Unsplash.” Unsplash.com. May 14, 2017. https://unsplash.com/photos/closeup-photography-of-woman-smiling-mEZ3PoFGs_k.

Unsplash. 2018. “Photo by Midas Hofstra on Unsplash.” Unsplash.com. June 15, 2018. https://unsplash.com/photos/man-taking-selfie-tidSLv-UaNs.

Unsplash. 2018. “Photo by Prince Akachi on Unsplash.” Unsplash.com. July 9, 2018. https://unsplash.com/photos/woman-smiling-beside-red-wall-LWkFHEGpleE.

whereslugo. 2017. “Man in Gray Crew-Neck T-Shirt.” Unsplash.com. Unsplash. October 4, 2017. https://unsplash.com/photos/man-in-gray-crew-neck-t-shirt-DMVD9RkZIwQ.
