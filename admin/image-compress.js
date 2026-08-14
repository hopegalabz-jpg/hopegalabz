/* ==========================================================================
   AUTOMATIC IMAGE COMPRESSION ON UPLOAD
   ==========================================================================
   Decap CMS has no built-in "shrink this photo" step, so without this file,
   whatever someone uploads (a phone photo can easily be 3-8 MB) gets stored
   in the GitHub repo at full size forever. Every future gala adds more.

   This script intercepts the moment a file is chosen in ANY image field's
   upload dialog, resizes/compresses it right there in the browser, and lets
   Decap upload the smaller version instead — before it ever reaches GitHub.
   Nothing about the editing experience changes for the person uploading;
   they pick a photo exactly like before and never see this happen.

   This only affects the Content Manager (admin) — it has no connection to
   the live website's pages at all.
   ========================================================================== */
(function () {
  var MAX_DIMENSION = 1600; // longest side, in pixels — matches the largest size any field's hint recommends
  var JPEG_QUALITY = 0.82; // sharp, not visibly compressed, while still shrinking a lot
  var SKIP_IF_UNDER_BYTES = 400 * 1024; // already-small files aren't worth re-compressing

  // Checks whether an image actually uses transparency. PNGs with real
  // transparency (like a logo on a see-through background) are kept as PNG;
  // everything else converts to JPEG, which compresses far better for photos.
  function hasTransparency(ctx, w, h) {
    try {
      var data = ctx.getImageData(0, 0, w, h).data;
      for (var i = 3; i < data.length; i += 4) {
        if (data[i] < 255) return true;
      }
      return false;
    } catch (e) {
      // If we can't inspect it for any reason, assume it might have
      // transparency and preserve PNG rather than risk flattening it.
      return true;
    }
  }

  function resizeImageFile(file) {
    return new Promise(function (resolve) {
      // Only ever touch real raster photos. SVGs and animated GIFs pass
      // through untouched — resizing would break or flatten them.
      if (!file || !file.type || file.type.indexOf("image/") !== 0) {
        resolve(file);
        return;
      }
      if (file.type === "image/svg+xml" || file.type === "image/gif") {
        resolve(file);
        return;
      }
      if (file.size <= SKIP_IF_UNDER_BYTES) {
        resolve(file);
        return;
      }

      var objectUrl = URL.createObjectURL(file);
      var img = new Image();

      img.onload = function () {
        try {
          var w = img.naturalWidth;
          var h = img.naturalHeight;
          var scale = Math.min(1, MAX_DIMENSION / Math.max(w, h));
          var newW = Math.max(1, Math.round(w * scale));
          var newH = Math.max(1, Math.round(h * scale));

          var canvas = document.createElement("canvas");
          canvas.width = newW;
          canvas.height = newH;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, newW, newH);
          URL.revokeObjectURL(objectUrl);

          var outputType = "image/jpeg";
          if (file.type === "image/png" && hasTransparency(ctx, newW, newH)) {
            outputType = "image/png";
          }

          canvas.toBlob(
            function (blob) {
              // Safety net: if for any reason the "compressed" result isn't
              // actually smaller, keep the original rather than make things
              // worse.
              if (!blob || blob.size >= file.size) {
                resolve(file);
                return;
              }
              var newFile = new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now(),
              });
              // Marks this file as already processed, so when the
              // synthetic "change" event below re-fires this same
              // handler, it's recognized and passed straight through
              // instead of being resized a second time.
              newFile.__isCompressed = true;
              resolve(newFile);
            },
            outputType,
            JPEG_QUALITY
          );
        } catch (err) {
          console.warn("[image-compress] Could not resize image, uploading original instead:", err);
          URL.revokeObjectURL(objectUrl);
          resolve(file);
        }
      };

      img.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  }

  function handleChange(event) {
    var input = event.target;
    if (!input || input.tagName !== "INPUT" || input.type !== "file") return;

    var files = input.files;
    if (!files || files.length === 0) return;

    // Only intercept image-picking inputs (Decap's file/document widget
    // uses this same input type but a different `accept` value).
    if ((input.accept || "").indexOf("image") === -1) return;

    // Already-compressed marker present means this is our own synthetic
    // re-fire below — let it pass through normally instead of looping.
    if (files[0].__isCompressed) return;

    // Stop this event here, in the capture phase, before Decap's own
    // upload handler ever sees it. We'll re-fire a normal "change" event
    // with the resized file once it's ready.
    event.stopImmediatePropagation();
    event.preventDefault();

    Promise.all(Array.prototype.map.call(files, resizeImageFile)).then(function (newFiles) {
      var dataTransfer = new DataTransfer();
      newFiles.forEach(function (f) {
        dataTransfer.items.add(f);
      });
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    });
  }

  // Capture phase (the `true` below) is what lets this run before Decap's
  // own listener, regardless of exactly where in the page Decap attaches
  // its own handler.
  document.addEventListener("change", handleChange, true);
})();
