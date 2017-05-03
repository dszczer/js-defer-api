# JS Defer API
Ultralight defer script loader for JavaScript.

## What is this exactly?
This simple and tricky API helps to defer script *in specified order* to load after HTML DOM is loaded. I have idea about `async` and `defer` **script** tags, but not all browsers support them. This API works fine on almost every browser.

## How to use it?
API contains 3 very simple global functions: DeferReady, DeferRenderScriptSequence and DeferRenderScriptTag. Simply place minified version of API in the `<head>` tag of HTML document.
```HTML
<script type="text/javascript">
  // ... minified API
</script>
```
Then load some scripts with `DeferReady` function.

### DeferReady
This function accept one argument, which is type of:
- anonymous function
- path of external script to load (must match /\.js$/)
- path of external stylesheet to load (must **not** match /\.js$/)
- array of both above (mixed function and/or paths)
- array of type to load and path (first item is 'js' or 'css', second is the path in the array)

#### Typical uses
```html
<head>
  <script type="text/javascript">
    // ... minified defer API
    
    // first, add to defer chain libraries or other dependencies
    DeferReady([
      '/js/jquery.min.js',
      '/js/jquery-ui.min.js',
      // versioned dependencies or CDN
      ['js', '/js/my-lib.min.js?v3'],
      ['css', '//some.cdn.com/file/3847386538'],
      // .. some other dependencies
    ]);
  </script>
</head>
<body>
  <!-- some HTML content -->
  <script type="text/javascript">
    DeferReady(function () {
      // load some application code for specific page
    });
  </script>
  <!-- some more HTML content -->
  <script type="text/javascript">
    // load other global application script
    DeferReady('/js/scripts.min.js');
    // ...
    // execute defer chain, at the very bottom of </body> tag
    DeferRenderScriptSequence();
  </script>
</body>
```

### DeferRenderScriptSequence
This function accept first argument as array of:
- function to call
- path of external script to load 
- array of both above (mixed function and/or paths)

in order of course. Great thing about this loader is fact, that next script (function) will not execute until the one before do. This makes defer loading dependencies very easy to implement.

#### Typical uses
```html
// ... whole content
<script type="text/javascript">
  // call defer chain to execute
  DeferRenderScriptSequence();

  // To be clear, above example IS NOT RELATED (on the same page) to the example below!

  // call custom chain immeadiately, respect the order
  DeferRenderScriptSequence([
    '/js/uploadPhoto.min.js',
    '/js/dragAndDrop.min.js',
    function () {
      $('#photoInput').uploadPhoto();
      $('#photoGallery').dragAndDrop();
    }
  ]);
</script>
```

### DeferRenderScriptTag
This simple function attach script tag to the DOM of document with specified `src` path, and optional `onload` second argument, what should be function to call after script is loaded.

#### Typical use
```html
<script type="text/javascript">
  $('#enableWowPlugin').click(function () {
    var me = $(this);
    // load extra JS
    DeferRenderScriptTag('/js/extra/wow.min.js', function () {
      $('.wow').wow();
      // do not load wow again by click...
      me.remove();
    });
  });
</script>
```

### DeferRenderLinkTag
This simple function attach link tag to the DOM of document with specified `href` path, and optional `onload` second argument, what should be function to call after stylesheet is loaded.

#### Typical use
```html
<script type="text/javascript">
  $('#enableWowPlugin').click(function () {
    var me = $(this);
    // load extra Stylesheet
    DeferRenderLinkTag('/css/extra/wow.min.css', function () {
      $('.wow').wow();
      // do not load wow again by click...
      me.remove();
    });
  });
</script>
```