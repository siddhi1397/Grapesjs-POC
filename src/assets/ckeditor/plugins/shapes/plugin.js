CKEDITOR.dtd.$editable.span = 1;
CKEDITOR.plugins.add('shapes', {
  // Shapes widget code.

  requires: 'widget',
  icons: 'shapes',

  init: function (editor) {
    // Plugin logic goes here...

    editor.widgets.add('shapes', {
      // Widget code.
      button: 'Create a rectangle',

      template: '<span id="editable" class="draggable-item">Please type here..</span>',

      editables: {
        content: {
          selector: '.draggable-item',
        }
      },

      allowedContent: 'span(!draggable-item);',

      requiredContent: 'span(draggable-item)',

      upcast: function (element) {
        return element.name == 'span' && element.hasClass('draggable-item');
      },
      
    });
  },
});