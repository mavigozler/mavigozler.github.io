# Responsive CSS: using Media Query

To create responsive CSS using media queries, you can test a wide range of properties related to the user’s device and environment. Below is a categorized list of commonly used media query properties:

---

## **Device Characteristics**

1. **Width and Height**
   - `min-width` / `max-width`: The width of the viewport.
   - `min-height` / `max-height`: The height of the viewport.

2. **Orientation**
   - `orientation`: Detects if the device is in `portrait` or `landscape` mode.

3. **Aspect Ratio**
   - `aspect-ratio`: Ratio of the viewport's width to height (e.g., `16/9`).
   - `min-aspect-ratio` / `max-aspect-ratio`: Minimum or maximum ratio of width to height.

4. **Resolution**
   - `min-resolution` / `max-resolution`: Checks screen resolution in DPI or DPPX (dots per pixel).
   - Common units:
     - `dpi` (dots per inch)
     - `dppx` (dots per pixel, e.g., `1dppx` = 96dpi)

---

## **Device Display**

1. **Screen Type**
   - `screen`: Used for devices with screens.
   - `print`: Target styles for print devices.

2. **Color**
   - `color`: The number of bits per color component available.
   - `min-color` / `max-color`: Minimum or maximum color depth.
   - `color-index`: Number of colors the device can render.

3. **Light Level**
   - `light-level`: Detects ambient lighting (`dim`, `normal`, `washed`).

4. **Display Features**
   - `prefers-reduced-motion`: Indicates if the user prefers less motion in animations.
   - `prefers-color-scheme`: Detects dark or light mode preference.

---

## **Interaction Capabilities**

1. **Input Types**
   - `pointer`: Detects input precision (`none`, `coarse`, `fine`).
   - `hover`: Checks if the device supports hovering (`hover`, `none`).

2. **Accessibility**
   - `forced-colors`: Indicates if a high-contrast mode is active.
   - `inverted-colors`: Detects inverted color mode.

---

## **Other Queries**

1. **Device Memory**
   - `device-memory`: Amount of memory available (e.g., `1GB`, `4GB`).

2. **Network**
   - `prefers-reduced-data`: Indicates if the user prefers reduced data usage.

3. **Grid Display**
   - `grid`: Detects if the output device is a grid display.

---

## Example Media Queries

```css
/* Adjust styles for screens wider than 768px */
@media screen and (min-width: 768px) {
  body {
    font-size: 18px;
  }
}

/* Detect dark mode */
@media (prefers-color-scheme: dark) {
  body {
    background-color: black;
    color: white;
  }
}

/* Reduce animations if the user prefers less motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
  }
}
```

---

## Resources

For more details, see:

- [MDN Web Docs - Using Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [CSS Tricks - Complete Guide to Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)
- [W3C Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/)

---

## Using JavaScript/TypeScript to Discover Device Characteristics/Properties

JavaScript (JS) and TypeScript (TS) allow you to access many properties of the user's device and environment, although not all of them are available due to security and privacy concerns. Below is a breakdown of the discoverable characteristics grouped by category:

---

### **Device Characteristics (by JS)**

1. **Viewport Dimensions**
   - **Window Dimensions**:

     ```js
     window.innerWidth; // Current viewport width
     window.innerHeight; // Current viewport height
     ```

   - **Screen Dimensions**:

     ```js
     screen.width; // Screen width
     screen.height; // Screen height
     screen.availWidth; // Usable width (excluding OS UI)
     screen.availHeight; // Usable height
     ```

2. **Orientation**
   Use the **ScreenOrientation API**:

   ```js
   screen.orientation.type; // "portrait-primary", "landscape-primary", etc.
   screen.orientation.angle; // Orientation angle (e.g., 0, 90)
   ```

3. **Aspect Ratio**
   Calculate from `window.innerWidth` and `window.innerHeight`:

   ```js
   let aspectRatio = window.innerWidth / window.innerHeight;
   ```

4. **Resolution**
   - **Pixel Density**:

     ```js
     window.devicePixelRatio; // e.g., 2 for high-DPI displays
     ```

---

### **Device Display (by JS)**

1. **Color Depth**

   ```js
   screen.colorDepth; // Number of bits per pixel
   ```

2. **Display Features**
   - **Prefers Color Scheme**:

     ```js
     window.matchMedia("(prefers-color-scheme: dark)").matches; // true if dark mode
     ```

   - **Prefers Reduced Motion**:

     ```js
     window.matchMedia("(prefers-reduced-motion: reduce)").matches;
     ```

3. **Media Capabilities (Experimental)**
   The Media Capabilities API provides additional insights about the user's device capabilities:

   ```js
   navigator.mediaCapabilities.decodingInfo({
     type: "file",
     video: { contentType: "video/mp4", width: 1920, height: 1080 },
   });
   ```

---

### **Interaction Capabilities (by JS)**

1. **Input Types**
   - Pointer Capabilities:

     ```js
     window.matchMedia("(pointer: fine)").matches; // High-precision pointer
     window.matchMedia("(pointer: coarse)").matches; // Low-precision pointer (e.g., touchscreen)
     ```

   - Hover Capabilities:

     ```js
     window.matchMedia("(hover: hover)").matches; // Device supports hover
     ```

2. **Accessibility Features**
   - Forced Colors Mode:

     ```js
     window.matchMedia("(forced-colors: active)").matches;
     ```

   - Inverted Colors:

     ```js
     window.matchMedia("(inverted-colors: inverted)").matches;
     ```

---

### **Other Queries (by JS)**

1. **Device Memory**

   ```js
   navigator.deviceMemory; // Amount of RAM in GB (e.g., 4 for 4GB)
   ```

2. **Network Status**
   - **Connection Information**:

     ```js
     navigator.connection.effectiveType; // "4g", "3g", etc.
     navigator.connection.saveData; // true if user prefers reduced data usage
     ```

3. **Battery Status**
   Using the **Battery Status API**:

   ```js
   navigator.getBattery().then(battery => {
     console.log(battery.level); // Battery level as a fraction (e.g., 0.75)
     console.log(battery.charging); // true if charging
   });
   ```

---

### **Limitations**

- **Unavailable Properties**: Certain properties, such as ambient light (`light-level`), are not accessible directly through JS for security and privacy reasons.
- **Browser Support**: Not all APIs are supported in all browsers. Use feature detection or fallback logic:

  ```js
  if ("deviceMemory" in navigator) {
    console.log(navigator.deviceMemory);
  } else {
    console.log("Device memory not supported");
  }
  ```

### **Resources for Further Exploration**

- [MDN Web Docs - Window Interface](https://developer.mozilla.org/en-US/docs/Web/API/Window)
- [MDN Web Docs - Screen](https://developer.mozilla.org/en-US/docs/Web/API/Screen)
- [Can I Use - Browser Support](https://caniuse.com/)

---

Absolutely! Optimizing your web content for the user's device is an essential step toward delivering a responsive and performant experience. Using the characteristics you can detect with JavaScript/TypeScript, you can adjust layout, images, styles, and even functionality dynamically to match the user's environment. Here are some suggestions for using the gathered information effectively:

---

## Using JS/TS to Assist Optimization of Responsive Styling

### **Optimization Ideas**

1. **Adjust Layout Based on Viewport Dimensions**

   - Use `window.innerWidth` and `window.innerHeight` to tailor the layout:

     ```js
     if (window.innerWidth < 768) {
       document.body.classList.add("mobile");
     } else {
       document.body.classList.remove("mobile");
     }
     ```

   - Complement this with CSS classes for responsive design.

2. **Serve Optimized Images**

   - Based on `window.devicePixelRatio`, serve higher-resolution images for devices with higher pixel densities:

     ```js
     let img = document.getElementById("hero-img");
     img.src = window.devicePixelRatio > 1
       ? "images/hero@2x.jpg"
       : "images/hero.jpg";
     ```

3. **Enhance Accessibility Features**

   - Respect user preferences for reduced motion or dark mode:

     ```js
     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
       document.body.classList.add("reduced-motion");
     }

     if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
       document.body.classList.add("dark-mode");
     }
     ```

4. **Adapt for Input Devices**

   - Provide larger touch targets for coarse pointer devices:

     ```js
     if (window.matchMedia("(pointer: coarse)").matches) {
       document.body.classList.add("touch-friendly");
     }
     ```

5. **Optimize for Performance**

   - Detect available RAM and adjust resource loading strategies:

     ```js
     if (navigator.deviceMemory && navigator.deviceMemory < 4) {
       console.log("Low-memory device detected. Optimizing assets...");
       // Load lower-resolution images or avoid loading heavy resources
     }
     ```

6. **Monitor Battery Status**

   - Avoid aggressive animations or intensive tasks when the battery is low:

     ```js
     navigator.getBattery().then(battery => {
       if (battery.level < 0.2 && !battery.charging) {
         console.log("Low battery detected. Minimizing power usage.");
         document.body.classList.add("low-battery-mode");
       }
     });
     ```

7. **Network-Sensitive Adjustments**

   - Reduce data usage on slow networks or when `saveData` is enabled:

     ```js
     if (navigator.connection && navigator.connection.saveData) {
       console.log("Save Data mode detected.");
       // Use lower-quality images or defer non-essential resources
     }
     ```

---

### **Best Practices**

- **Graceful Fallbacks**: Always ensure your site works even when these properties aren't supported by the user's browser.
- **Progressive Enhancement**: Start with a baseline, then add optimizations for specific capabilities.
- **Cache-Control**: Use browser caching and lazy loading for efficient resource delivery.

By dynamically responding to these device characteristics, you can make your static web pages feel interactive and ensure they perform well across a variety of devices and environments. Let me know if you'd like help with a specific implementation!
